// Public integration address supplied by the operator, not an API secret.
export const configuredBookingEmbed = 'https://login.smoobu.com/de/booking-tool/iframe/1947006';
export function smoobuEmbedUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.origin !== 'https://login.smoobu.com' || url.username || url.password || url.search || url.hash ||
        !/^\/[a-z]{2}\/booking-tool\/iframe\/[1-9]\d*$/.test(url.pathname)) return null;
    return url.href;
  } catch { return null; }
}
