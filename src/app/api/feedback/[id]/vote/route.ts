import db from '@/lib/db';

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  db.prepare('UPDATE feedback SET votes = votes + 1 WHERE id = ?').run(Number(id));
  return Response.json({ success: true });
}