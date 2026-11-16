import { NextRequest, NextResponse } from 'next/server';
import DatabaseService from '@/lib/database';

// Public, read-only website content (collections site_<table>, loaded by scripts/import-site-content.js).
// Each table gets the same filter + order the website used with Supabase. ?id=<id> returns one row.
const TABLES: Record<string, { filter: Record<string, unknown>; sort: Record<string, 1 | -1> }> = {
  pooja_services: { filter: { status: 'active' }, sort: { created_at: 1 } },
  mantra_services: { filter: { status: 'active' }, sort: { created_at: 1 } },
  products: { filter: { status: 'active' }, sort: { created_at: 1 } },
  blog_posts: { filter: { status: 'published' }, sort: { created_at: -1 } },
  homepage_steps: { filter: { status: 'active' }, sort: { sort_order: 1 } },
  testimonials: { filter: { status: 'active' }, sort: { sort_order: 1 } },
  site_content: { filter: {}, sort: { key: 1 } },
  mano_beliefs: { filter: { is_active: true }, sort: { sort_order: 1 } },
  astrology_articles: { filter: { is_active: true }, sort: { sort_order: 1 } },
  horoscopes: { filter: { is_active: true }, sort: { sort_order: 1 } },
  nakshatras: { filter: { is_active: true }, sort: { sort_order: 1 } },
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  const cfg = TABLES[table];
  if (!cfg) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

  const id = request.nextUrl.searchParams.get('id');
  const col = await DatabaseService.getCollection(`site_${table}`);
  const rows = await col
    .find(id ? { ...cfg.filter, id } : cfg.filter, { projection: { _id: 0 } })
    .sort(cfg.sort)
    .toArray();
  if (id && !rows.length) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: id ? rows[0] : rows }, { headers: { 'Cache-Control': 'public, max-age=60' } });
}
