// Loads the website's content (pooja, mantra, products, blog, testimonials, …) from scripts/data/site-content.json
// (snapshot of the client's old Supabase project) into MongoDB collections site_<table>, served by /api/site/<table>.
// Skips tables that already have data so later admin edits aren't lost; pass --force to overwrite.
// Run from admin/: node scripts/import-site-content.js [--force]
require('dotenv').config({ path: '.env', quiet: true });
const { MongoClient } = require('mongodb');
const data = require('./data/site-content.json');

(async () => {
  const c = await MongoClient.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017');
  const db = c.db(process.env.DB_NAME || 'astromateDB');
  const force = process.argv.includes('--force');
  for (const [table, rows] of Object.entries(data)) {
    const col = db.collection(`site_${table}`);
    if (!force && await col.countDocuments()) { console.log('skip', table, '(has data)'); continue; }
    await col.deleteMany({});
    if (rows.length) await col.insertMany(rows.map(r => ({ ...r })));
    await col.createIndex(table === 'site_content' ? { key: 1 } : { id: 1 }, { unique: true });
    console.log('imported', table, rows.length);
  }
  await c.close();
})();
