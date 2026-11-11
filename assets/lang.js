/* Ludawn language switch. Every page carries both Turkish and English;
   this picks one. Order: ?lang= in the URL, #tr / #en, the visitor's
   earlier choice, then the browser's languages. No JS = both shown. */
(function () {
  var d = document.documentElement, pick = null, saved = null;
  d.classList.add("js");
  function ok(v) { return v === "tr" || v === "en" ? v : null; }
  try { saved = ok(localStorage.getItem("ludawn-lang")); } catch (e) {}
  try { pick = ok(new URLSearchParams(location.search).get("lang")); } catch (e) {}
  if (!pick) pick = ok(location.hash.slice(1));
  if (!pick) pick = saved;
  if (!pick) {
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    for (var i = 0; i < langs.length && !pick; i++) {
      var p = String(langs[i]).toLowerCase().slice(0, 2);
      if (p === "tr") pick = "tr"; else if (p === "en") pick = "en";
    }
    pick = pick || "en";
  }
  function apply(l) {
    d.setAttribute("data-lang", l);
    d.lang = l;
    var t = d.getAttribute("data-title-" + l);
    if (t) document.title = t;
    var b = document.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < b.length; i++) b[i].setAttribute("aria-pressed", b[i].getAttribute("data-set-lang") === l ? "true" : "false");
  }
  apply(pick);
  document.addEventListener("DOMContentLoaded", function () {
    apply(d.getAttribute("data-lang"));
    document.addEventListener("click", function (e) {
      var el = e.target.closest && e.target.closest("[data-set-lang],a[href='#tr'],a[href='#en']");
      if (!el) return;
      var l = ok(el.getAttribute("data-set-lang")) || ok(el.getAttribute("href").slice(1));
      if (!l) return;
      e.preventDefault();
      try { localStorage.setItem("ludawn-lang", l); } catch (x) {}
      apply(l);
      if (location.hash === "#tr" || location.hash === "#en") history.replaceState(null, "", location.pathname + location.search);
    });
  });
})();
