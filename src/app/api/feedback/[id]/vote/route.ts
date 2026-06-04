import { initDb } from '@/lib/db';

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const db = await initDb();
  await db.prepare(
    'UPDATE feedback SET votes = votes + 1 WHERE id = ?'
  ).bind(Number(id)).run();
  return Response.json({ success: true });
}