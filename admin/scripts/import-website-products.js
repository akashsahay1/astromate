// Imports the 10 products from the client's website (scripts/data/site-content.json → products) into the real shop
// collection `products`, so the app and the website sell the same items through /api/products and /api/orders.
// Idempotent: keyed on site_product_id (the website row's uuid); re-running updates text/price/stock, keeps product_id.
// English is the main name/description (the app UI is English); Hindi is kept in name_hi / description_hi.
// Images are downloaded into public/uploads/seed/ (served like any upload) with a media doc, because the products
// API builds image URLs as host + file_path and can't serve external URLs.
// Remove later: db.products.deleteMany({ demo_seed: true }); db.media.deleteMany({ demo_seed: true, file_type: 'product_image' })
// Run from admin/: NODE_PATH=./node_modules node scripts/import-website-products.js
require('dotenv').config({ path: '.env', quiet: true });
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Website category → admin product_categories name (the app filters on these)
const CATEGORY = { Bracelet: 'Jewelry', Pendant: 'Jewelry', Yantra: 'Yantras', Plate: 'Crystals', 'Remedy Kit': 'Others' };
const rand = () => Math.random().toString(36).slice(2, 10);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

(async () => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'site-content.json'), 'utf8')).products;
  const c = await MongoClient.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017');
  const db = c.db(process.env.DB_NAME || 'astromateDB');
  const dir = path.join(__dirname, '..', 'public', 'uploads', 'seed');
  fs.mkdirSync(dir, { recursive: true });
  const now = new Date();

  for (const p of rows) {
    const key = p.id;
    const name = p.name_en || p.name;
    // Image: download once into public/uploads/seed/
    const file = `product-${key.slice(0, 8)}.jpg`;
    const dest = path.join(dir, file);
    if (!fs.existsSync(dest) && p.image_url) {
      const r = await fetch(p.image_url);
      if (!r.ok) throw new Error(`image ${p.image_url}: ${r.status}`);
      fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
    }
    const media_id = `media_seed_product_${key.slice(0, 8)}`;
    if (fs.existsSync(dest)) {
      await db.collection('media').updateOne({ media_id }, {
        $set: {
          media_id, filename: file, original_name: file, file_path: `/uploads/seed/${file}`, file_size: fs.statSync(dest).size,
          mime_type: 'image/jpeg', file_type: 'product_image', uploaded_by: 'seed', associated_record: key, is_external: false,
          demo_seed: true, updated_at: now,
        },
        $setOnInsert: { uploaded_at: now, created_at: now },
      }, { upsert: true });
    }

    const res = await db.collection('products').updateOne({ site_product_id: key }, {
      $set: {
        name, name_hi: p.name, description: p.description_en || p.description, description_hi: p.description,
        price: Number(p.price), original_price: Number(p.original_price) || Number(p.price),
        discount_percentage: p.original_price > p.price ? Math.round((1 - p.price / p.original_price) * 100) : 0,
        category: CATEGORY[p.category] || 'Others', subcategory: p.category, brand: 'Astromate',
        stock_quantity: Number(p.stock) || 0, is_active: p.status === 'active', status: p.status === 'active' ? 'active' : 'inactive',
        image_id: fs.existsSync(dest) ? media_id : null, images: [],
        tags: p.badge ? [p.badge] : [], rating: p.rating || 0, total_sales: p.sold_count || 0,
        is_bestseller: p.badge === 'BESTSELLER', slug: slug(name), meta_title: name, meta_description: p.description_en || '',
        demo_seed: true, updated_at: now,
      },
      $setOnInsert: {
        product_id: `product_${Date.now()}_${rand()}`, sku: `AST-WEB-${key.slice(0, 6).toUpperCase()}`,
        is_featured: false, free_shipping: false, shipping_cost: 0, total_reviews: 0, review_count: 0,
        return_policy: '7 days return policy', created_at: now,
      },
    }, { upsert: true });
    console.log(res.upsertedCount ? 'added  ' : 'updated', name);
  }
  await c.close();
})().catch((e) => { console.error(e); process.exit(1); });
