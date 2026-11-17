/* DR MULTISERVICES V4 — PostHog, consent-first, no form values or personal data. */
(() => {
  "use strict";
  if (window.__DR_POSTHOG_V4__) return;
  window.__DR_POSTHOG_V4__ = true;
  const config = window.DR_POSTHOG_CONFIG || {};
  // Deliberately do nothing until the deployment has supplied its public project token.
  if (!/^phc_[a-zA-Z0-9_-]+$/.test(String(config.token || "")) ||
      config.host !== "https://eu.i.posthog.com") return;

  const consentKey = "dr_v4_analytics_consent";
  const permittedEvents = new Set([
    "$pageview", "service_page_view", "quote_form_view",
    "quote_submit_attempt", "quote_submit_result",
    "whatsapp_cta_click", "call_cta_click"
  ]);
  let ready = false, lastPath = null, observed = new WeakSet(), viewSent = new WeakSet();
  let formObserver = null, routeObserver = null, notice = null;

  function getChoice() {
    try { return localStorage.getItem(consentKey); } catch (_) { return null; }
  }
  function setChoice(value) {
    try { localStorage.setItem(consentKey, value); } catch (_) {}
  }
  function safePath() {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    if (path.length > 120 || /@|%|\d{5,}/.test(path) ||
        !/^\/[a-z0-9/-]*$/i.test(path)) return "/other";
    return path;
  }
  function safeEvent(name, extra) {
    if (!ready || getChoice() !== "yes" || !permittedEvents.has(name)) return;
    const path = safePath();
    // Explicit allowlist: never capture form fields, contact information or query strings.
    const properties = { path };
    if (extra && /^[a-z0-9-]{1,48}$/.test(String(extra.service || ""))) {
      properties.service = extra.service;
    }
    if (extra && ["valid", "invalid", "whatsapp_prepared"].includes(extra.result)) {
      properties.result = extra.result;
    }
    if (name === "$pageview") properties.$current_url = location.origin + path;
    window.posthog.capture(name, properties);
  }
  function scanForms() {
    document.querySelectorAll("form").forEach(form => {
      if (observed.has(form) || !form.querySelector('[name="nom"]') ||
          !form.querySelector('[name="message"]')) return;
      observed.add(form);
      if (!("IntersectionObserver" in window)) {
        if (!viewSent.has(form)) {
          viewSent.add(form); safeEvent("quote_form_view");
        }
        return;
      }
      formObserver = formObserver || new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !viewSent.has(entry.target)) {
            viewSent.add(entry.target);
            safeEvent("quote_form_view");
            formObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      formObserver.observe(form);
    });
  }
  function routeChanged() {
    if (!ready || getChoice() !== "yes") return;
    const path = safePath();
    if (path !== lastPath) {
      lastPath = path;
      safeEvent("$pageview");
      if (/^\/services\/[a-z0-9-]+$/.test(path) ||
          /^\/(climatisation|electricite|chambre-froide|chauffage|domotique|isolation|plomberie|piscines|videosurveillance|panneaux-solaires)-marrakech$/.test(path)) {
        safeEvent("service_page_view", { service: path.split("/").pop().replace(/-marrakech$/, "") });
      }
    }
    scanForms();
  }
  function listen() {
    window.addEventListener("popstate", routeChanged);
    window.addEventListener("hashchange", routeChanged);
    // The V4 React router also changes routes without a full reload.
    routeObserver = new MutationObserver(() => routeChanged());
    routeObserver.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("click", event => {
      const anchor = event.target.closest && event.target.closest("a[href]");
      if (!anchor) return;
      const raw = anchor.getAttribute("href") || "";
      if (/^tel:/i.test(raw)) safeEvent("call_cta_click");
      else {
        try {
          const url = new URL(raw, location.href);
          if (["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(url.hostname)) {
            safeEvent("whatsapp_cta_click");
          } else if (url.origin === location.origin) {
            setTimeout(routeChanged, 250);
          }
        } catch (_) {}
      }
    }, true);
    // Listen on WINDOW (before the contact script's document-level submit handler).
    window.addEventListener("submit", event => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) ||
          !form.querySelector('[name="nom"]') || !form.querySelector('[name="message"]')) return;
      const valid = form.checkValidity();
      safeEvent("quote_submit_attempt", { result: valid ? "valid" : "invalid" });
      // The GitHub Pages contact form only prepares a WhatsApp message; it does NOT send a quote.
      if (valid) safeEvent("quote_submit_result", { result: "whatsapp_prepared" });
    }, true);
    routeChanged();
  }
  function activate() {
    if (ready) { window.posthog.opt_in_capturing(); routeChanged(); return; }
    if (window.__DR_POSTHOG_LOADING__) return;
    window.__DR_POSTHOG_LOADING__ = true;

    // Official asynchronous PostHog web SDK loader.
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){
      function g(t,e){var o=e.split(".");2===o.length&&(t=t[o[0]],e=o[1]);
        t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)));};}
      (p=t.createElement("script")).type="text/javascript";
      p.crossOrigin="anonymous";p.async=true;p.src=s.api_host+"/static/array.js";
      (r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);
      var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],
        u.toString=function(t){var e="posthog";return a!=="posthog"&&(e+="."+a),t||(e+=" (stub)"),e;},
        u.people.toString=function(){return u.toString(1)+".people";},
        o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing opt_in_capturing has_opted_out_capturing has_opted_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group".split(" "),
        n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a]);},e.__SV=1);}
    (document,window.posthog||[]);
    window.posthog.init(config.token, {
      api_host: config.host,
      defaults: "2026-08-30",
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
      person_profiles: "never",
      // Filter all event data even if SDK automatic properties change later.
      before_send: function(event) {
        if (!event || !permittedEvents.has(event.event)) return null;
        const p = event.properties || {};
        Object.keys(p).forEach(key => {
          if (/url|referr|search|query|email|phone|name|text|href|element|form/i.test(key) &&
              key !== "$current_url") delete p[key];
        });
        p.$current_url = location.origin + safePath();
        event.properties = p;
        return event;
      },
      loaded: function() {
        ready = true;
        if (getChoice() === "yes") listen();
        else window.posthog.opt_out_capturing();
      }
    });
  }
  function closeNotice() { if (notice) { notice.remove(); notice = null; } }
  function showNotice() {
    closeNotice();
    notice = document.createElement("div");
    notice.setAttribute("role", "region");
    notice.setAttribute("aria-label", "Préférences de statistiques");
    notice.style.cssText = "position:fixed;bottom:12px;left:12px;right:12px;z-index:99999;max-width:520px;margin:auto;background:#151515;color:#f4f0e8;border:1px solid #d4af37;border-radius:12px;padding:15px 18px;box-shadow:0 8px 25px #0008;font:14px/1.5 system-ui,sans-serif";
    const text = document.createElement("p");
    text.textContent = "Autorisez-vous des statistiques de fréquentation pour améliorer ce site ? Aucun contenu des formulaires n'est transmis. Vous pouvez changer d'avis à tout moment.";
    const row = document.createElement("div"); row.style.cssText = "display:flex;flex-wrap:wrap;gap:10px;margin-top:10px";
    function button(label, accept) {
      const b = document.createElement("button"); b.type = "button"; b.textContent = label;
      b.style.cssText = "cursor:pointer;padding:9px 12px;border-radius:7px;border:1px solid #d4af37;background:" + (accept ? "#d4af37;color:#151515" : "#151515;color:#f4f0e8");
      b.addEventListener("click", () => {
        setChoice(accept ? "yes" : "no");
        closeNotice();
        if (accept) activate();
        else if (window.posthog && ready) window.posthog.opt_out_capturing();
      });
      return b;
    }
    row.append(button("Autoriser", true), button("Refuser", false));
    notice.append(text, row);
    document.body.append(notice);
  }
  function addPreferencesLink() {
    const footer = document.querySelector("footer");
    if (!footer || document.querySelector("[data-dr-analytics-preferences]")) return;
    const b = document.createElement("button"); b.type = "button";
    b.dataset.drAnalyticsPreferences = "1";
    b.textContent = "Préférences statistiques";
    b.style.cssText = "background:none;border:0;color:inherit;text-decoration:underline;cursor:pointer;font:inherit;margin:8px";
    b.addEventListener("click", showNotice);
    footer.append(b);
  }
  function start() {
    addPreferencesLink();
    if (getChoice() === "yes") activate();
    else if (getChoice() !== "no") showNotice();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();