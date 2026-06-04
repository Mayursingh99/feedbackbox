import db from '@/lib/db';

export async function POST(req, { params }) {
  db.prepare('UPDATE feedback SET votes = votes + 1 WHERE id = ?').run(Number(params.id));
  return Response.json({ success: true });
}