// Theme toggle for light/dark modes using CSS variables
// Persists choice in localStorage and falls back to OS preference.

(function () {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  var STORAGE_KEY = "theme";

  function getPreferredTheme() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        return stored;
      }
    } catch (e) {
      // ignore storage errors and fall through to media query
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }

    return "dark";
  }

  function applyTheme(theme) {
    var body = document.body;
    if (!body) return;

    body.classList.toggle("light-theme", theme === "light");
    body.classList.toggle("dark-theme", theme === "dark");

    document.documentElement.setAttribute("data-theme", theme);

    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.setAttribute("data-theme", theme);
      var label = theme === "light" ? "Switch to dark theme" : "Switch to light theme";
      toggle.setAttribute("aria-label", label);

      var icon = toggle.querySelector(".theme-toggle-icon");
      if (icon) {
        icon.textContent = theme === "light" ? "☀" : "☾";
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var currentTheme = getPreferredTheme();
    applyTheme(currentTheme);

    var toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
      try {
        window.localStorage.setItem(STORAGE_KEY, nextTheme);
      } catch (e) {
        // ignore storage errors
      }
      applyTheme(nextTheme);
    });
  });
})();
