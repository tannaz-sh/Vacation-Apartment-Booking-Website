import { contactSchema } from '@/lib/domain';
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const expectedOrigin = process.env.SITE_URL || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:3000' : null);
  if (!origin || !expectedOrigin || origin !== expectedOrigin) return Response.json({error: 'origin'}, {status:403});
  if (!request.headers.get('content-type')?.startsWith('application/json')) return Response.json({error:'content-type'}, {status:415});
  // Enforce actual streamed bytes; Content-Length alone is attacker-controlled.
  const reader = request.body?.getReader();
  if (!reader) return Response.json({error:'body'}, {status:400});
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const {done, value} = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 24000) { await reader.cancel(); return Response.json({error:'size'}, {status:413}); }
      chunks.push(value);
    }
    const parsed = contactSchema.safeParse(JSON.parse(Buffer.concat(chunks).toString('utf8')));
    if (!parsed.success) return Response.json({error:'validation'}, {status:400});
    // Fail closed until mail transport, durable rate limiting and approved privacy text exist.
    // Do not persist or log personal data and never pretend the message was delivered.
    return Response.json({error:'delivery_unavailable'}, {status:503});
  } catch { return Response.json({error:'body'}, {status:400}); }
}
