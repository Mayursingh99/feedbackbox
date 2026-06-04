import db from '@/lib/db';

export async function GET() {
  const rows = db.prepare('SELECT * FROM feedback ORDER BY votes DESC').all();
  return Response.json(rows);
}

export async function POST(req) {
  const { title, description } = await req.json();
  db.prepare('INSERT INTO feedback (title, description) VALUES (?, ?)').run(title, description);
  return Response.json({ success: true });
}