import { initDb } from '@/lib/db';

interface FeedbackBody {
  title: string;
  description: string;
}

export async function GET() {
  const db = await initDb();
  const result = await db.prepare(
    'SELECT * FROM feedback ORDER BY votes DESC'
  ).all();
  return Response.json(result.results);
}

export async function POST(req: Request) {
  const body = await req.json() as FeedbackBody;
  const { title, description } = body;
  const db = await initDb();
  await db.prepare(
    'INSERT INTO feedback (title, description) VALUES (?, ?)'
  ).bind(title, description).run();
  return Response.json({ success: true });
}