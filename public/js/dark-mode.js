(function () {
  var stored = localStorage.getItem("dark-mode");
  if (stored === "true" || stored === "false") {
    document.documentElement.classList.toggle("dark", stored === "true");
  } else {
    document.documentElement.classList.toggle(
      "dark",
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }
})();

function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(
    "dark-mode",
    document.documentElement.classList.contains("dark")
  );
  var btn = document.querySelector(".dark-mode-toggle");
  if (btn)
    btn.setAttribute(
      "aria-pressed",
      document.documentElement.classList.contains("dark")
    );
}
