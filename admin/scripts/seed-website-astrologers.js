// Seeds the 13 astrologers from the client's website (home + /astrologers page) as verified, featured astrologers. Idempotent (keyed on phone).
// Phones start with 1, which no Indian mobile does, so they can never collide with a real signup.
// Remove later from the admin panel, or: db.users.deleteMany({ demo_seed: true }); db.media.deleteMany({ demo_seed: true })
// Names and bios are in English (the app UI is English).
// Run from admin/: node scripts/seed-website-astrologers.js
require('dotenv').config({ path: '.env', quiet: true });
const { MongoClient } = require('mongodb');

const img = (id) => `https://images.unsplash.com/photo-${id}?w=400&h=533&fit=crop`;
const A = [
  ['Pandit Manohar Sharma', 35, 45, ['Vedic Astrology', 'Kundali Reading', 'Life Coach'], 25, 4.9, ['Hindi', 'English', 'Sanskrit'], true, '1472099645785-5658abf4ff4e',
    'Pandit Manohar Sharma has practised Vedic astrology for 25 years. He specialises in Kundli analysis, marriage matching and career guidance.'],
  ['Pandit Aman Pandey', 25, 35, ['Kundali Reading', 'Vedic Astrology', 'Numerology'], 18, 4.8, ['Hindi', 'English'], true, '1500648767791-00dcc994a43e',
    'Pandit Aman Pandey is an expert in Kundli analysis, with deep knowledge of Dasha periods, planetary transits and Manglik Dosha.'],
  ['Acharya Vinod Kumar', 30, 40, ['Vastu Shastra', 'Vedic Astrology', 'Face Reading'], 22, 4.9, ['Hindi', 'English', 'Bengali'], true, '1560250097-0b93528c311a',
    'Acharya Vinod Kumar is a well-known Vastu Shastra expert who advises on homes, offices and business premises.'],
  ['Acharya Krishna Murthy', 20, 30, ['Tarot Reading', 'Life Coach'], 15, 4.7, ['Hindi', 'Marathi'], false, '1519085360753-af0119f7cbe7',
    'Acharya Krishna Murthy has 15 years of experience in tarot reading and answers questions on love, career and the future.'],
  ['Pandit Rajesh Tripathi', 28, 38, ['Numerology', 'Name Numerology', 'Vedic Astrology', 'Prashna Astrology'], 20, 4.9, ['Hindi', 'English', 'Gujarati'], true, '1507003211169-0a1dd7228f2d',
    'Pandit Rajesh Tripathi is a numerology and Lo Shu Grid expert, skilled in name correction, business names and mobile number analysis.'],
  ['Smt. Hena Devi', 64, 74, ['Tarot Reading', 'Numerology'], 10, 4.7, ['Hindi', 'English'], true, '1544005313-94ddf0286df2',
    'Hena Devi is experienced in tarot and numerology, and specialises in questions about love and career.', 'female'],
  ['Devani Sharma', 24, 34, ['Vastu Shastra', 'Tarot Reading', 'Life Coach'], 4, 4.6, ['Hindi'], true, '1531123897727-8f129e1688ce',
    'Devani Sharma is a young Vastu and tarot expert. Reach out to her for life guidance.', 'female'],
  ['Pandit Abhinav Mishra', 30, 40, ['Vedic Astrology', 'Lal Kitab'], 16, 4.8, ['Hindi', 'Sanskrit'], false, '1618077360395-f3068be8e001',
    'Pandit Abhinav Mishra is versed in Lal Kitab and Vedic astrology, and is known for precise remedies.'],
  ['Krishvi Rathore', 36, 46, ['Tarot Reading', 'Face Reading'], 4, 4.7, ['Hindi', 'Punjabi'], true, '1487412720507-e7ab37603c6f',
    'Krishvi Rathore is skilled in tarot and face reading, and specialises in love and relationship concerns.', 'female'],
  ['Acharya Brahmendra', 30, 40, ['Vedic Astrology', 'Life Coach'], 10, 4.8, ['Telugu', 'Hindi'], true, '1519085360753-af0119f7cbe7',
    'Acharya Brahmendra is an expert in Vedic astrology and life management. Consult him for career advice.'],
  ['Shubhangi Ji', 63, 73, ['Vedic Astrology', 'Numerology'], 8, 4.9, ['English', 'Hindi'], true, '1573496359142-b8d87734a5a2',
    'Shubhangi is versed in Vedic astrology and numerology, and specialises in marriage matching.', 'female'],
  ['Meenakshi Iyer', 20, 30, ['Vedic Astrology', 'Nadi Astrology', 'Prashna Astrology'], 5, 4.6, ['Tamil', 'Hindi'], true, '1580489944761-15a19d654956',
    'Meenakshi Iyer is experienced in Nadi astrology and Prashna Kundli. Consult her for guidance about the future.', 'female'],
  ['Pandit Ravish Dubey', 16, 26, ['Vedic Astrology', 'Face Reading'], 3, 4.7, ['Hindi', 'Punjabi'], true, '1506794778202-cad84cf45f1d',
    'Pandit Ravish Dubey is a young, popular Vedic astrologer offering affordable consultations.'],
];

(async () => {
  const c = await MongoClient.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017');
  const db = c.db(process.env.DB_NAME || 'astromateDB');
  const now = new Date();
  for (const [i, [name, chat, call, skills, exp, rating, languages, online, photo, bio, gender = 'male']] of A.entries()) {
    const phone = `1000000${String(i + 1).padStart(3, '0')}`;
    const existing = await db.collection('users').findOne({ phone_number: phone, demo_seed: true });
    const user_id = existing?.user_id || `user_${now.getTime() + i}_seed${i + 1}`;
    const media_id = `media_seed_astro_${i + 1}`;
    await db.collection('media').updateOne({ media_id }, { $set: {
      media_id, filename: `${media_id}.jpg`, original_name: `${media_id}.jpg`, file_path: img(photo), file_size: 0,
      mime_type: 'image/jpeg', file_type: 'profile_image', uploaded_by: user_id, is_external: true, demo_seed: true, updated_at: now,
    }, $setOnInsert: { created_at: now } }, { upsert: true });
    await db.collection('users').updateOne({ phone_number: phone, demo_seed: true }, { $set: {
      user_id, user_type: 'astrologer', full_name: name, country_code: '+91', phone_number: phone, gender,
      account_status: 'active', verification_status: 'verified', is_featured: true, is_online: online,
      bio, skills, languages, qualifications: ['Jyotish Acharya'], experience_years: exp, rating, total_reviews: 0,
      chat_rate: chat, call_rate: call, video_rate: call + 10, profile_image_id: media_id,
      city: 'Varanasi', state: 'Uttar Pradesh', country: 'India', demo_seed: true, updated_at: now,
    }, $setOnInsert: { created_at: now } }, { upsert: true });
    console.log(existing ? 'updated' : 'created', name, user_id);
  }
  await c.close();
})();
