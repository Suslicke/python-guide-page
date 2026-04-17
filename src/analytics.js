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

// Forward an analytics event. Silent no-op when gtag isn't loaded (dev mode,
// ad-blocker, no VITE_GA_ID). Consent Mode v2 decides whether the request is
// tracked or cookieless — we don't gate that here.
export function trackEvent(name, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", name, params);
}

// Update the current consent choice. Called from the cookie banner.
export function setAnalyticsConsent(value) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("consent", "update", { analytics_storage: value });
}

// Attach an optional username as a GA4 user property + user_id so reports
// can be sliced by individual user. Only called after the user explicitly
// types a name — voluntary personal data.
export function setAnalyticsUser(username) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  const clean = (username || "").trim().slice(0, 64);
  if (clean) {
    window.gtag("set", "user_properties", { username: clean });
    window.gtag("set", { user_id: clean });
  } else {
    window.gtag("set", "user_properties", { username: null });
    window.gtag("set", { user_id: null });
  }
}
