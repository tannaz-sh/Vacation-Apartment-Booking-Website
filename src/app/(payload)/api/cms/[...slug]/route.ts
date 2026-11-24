import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes';
import config from '@/payload.config';
import { cmsConfigured } from '@/lib/cms-settings';

const guard = (handler: ReturnType<typeof REST_GET>) => async (request: Request, context: Parameters<typeof handler>[1]) => {
  if (!cmsConfigured()) return Response.json({ error: 'cms_unavailable' }, { status: 503 });
  const { slug } = await context.params;
  if (slug?.[0] === 'admins' && slug[1] === 'first-register') {
    return Response.json({ error: 'registration_disabled' }, { status: 403 });
  }
  return handler(request, context);
};
export const GET = guard(REST_GET(config));
export const POST = guard(REST_POST(config));
export const PATCH = guard(REST_PATCH(config));
export const DELETE = guard(REST_DELETE(config));
export const PUT = guard(REST_PUT(config));
export const OPTIONS = guard(REST_OPTIONS(config));
