import db from '@/lib/db';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  db.prepare('UPDATE feedback SET votes = MAX(0, votes - 1) WHERE id = ?').run(Number(params.id));
  return Response.json({ success: true });
}