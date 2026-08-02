export const siteUrl = (() => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const value = configured || (vercel ? `https://${vercel}` : "http://localhost:3000");

  try {
    return new URL(value);
  } catch {
    return new URL("http://localhost:3000");
  }
})();
