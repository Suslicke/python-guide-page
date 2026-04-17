// Dynamically load Google Analytics when VITE_GA_ID is set at build time.
// Consent Mode v2 starts with analytics_storage denied; the cookie banner
// flips it to "granted" or keeps it "denied" via window.gtag("consent","update").
export function initAnalytics() {
  const id = import.meta.env.VITE_GA_ID;
  if (!id) return false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
  return true;
}
