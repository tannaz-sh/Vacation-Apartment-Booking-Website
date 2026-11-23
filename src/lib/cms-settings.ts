export function cmsConfigured() {
  return Boolean(process.env.DATABASE_URL && (process.env.PAYLOAD_SECRET?.length ?? 0) >= 32);
}
