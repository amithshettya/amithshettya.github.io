import { BLOG_CATEGORIES, NAV_LINKS } from "./config.ts";

export function renderSidebar(activePage: string): string {
  const navHtml = NAV_LINKS.map(({ href, label, page }) => {
    const isActive = activePage === page;
    const classes = isActive ? "sidebar-link sidebar-link-active" : "sidebar-link";
    const aria = isActive ? ' aria-current="page"' : "";
    return `        <a href="${href}" class="${classes}"${aria}>${label}</a>`;
  }).join("\n");

  const categoryHtml = BLOG_CATEGORIES.map(({ slug, name }) =>
    `          <a href="/blog/${slug}" class="sidebar-link text-sm">${name}</a>`
  ).join("\n");

  return `    <aside class="sidebar-nav w-64 border-r border-grid-strong bg-ground/80 backdrop-blur-sm p-6 flex flex-col relative z-40 shrink-0 dark:bg-dark-ground/80 dark:border-dark-grid-strong">
      <div class="mb-8">
        <p class="font-grotesk text-xl font-medium tracking-wide text-ink dark:text-dark-ink">Amith Shetty</p>
        <p class="text-sm text-ink-soft dark:text-dark-ink-soft font-grotesk">Software Engineer</p>
      </div>
      <nav class="space-y-1" aria-label="Main navigation">
${navHtml}
        <div class="pl-4 mt-2 space-y-1">
${categoryHtml}
        </div>
      </nav>
    </aside>`;
}

export function wrapInLayout(
  content: string,
  opts: { title: string; activePage: string; description?: string; htmx?: boolean },
): string {
  const metaDesc =
    opts.description ||
    "Amith Shetty - Software engineer working on networking and distributed systems.";
  const htmxScript = opts.htmx
    ? '\n  <script src="https://unpkg.com/htmx.org@1.9.10"></script>'
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${opts.title} | Amith Shetty</title>
  <meta name="description" content="${metaDesc}">
  <link href="/css/output.css" rel="stylesheet">${htmxScript}
  <script src="/js/dark-mode.js"></script>
  <script src="/js/sidebar.js"></script>
</head>
<body>
  <a href="#main-content" class="skip-to-content">Skip to content</a>
  <button class="mobile-menu-btn" onclick="toggleSidebar()" aria-label="Open menu">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  </button>
  <button onclick="toggleDarkMode()" class="dark-mode-toggle fixed top-4 right-4 z-50 p-2 rounded hover:bg-grid-line/50 dark:hover:bg-dark-grid-line/50 transition-colors text-ink-soft dark:text-dark-ink-soft" aria-label="Toggle dark mode" aria-pressed="false">
    <svg class="w-5 h-5 icon-moon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
    </svg>
    <svg class="w-5 h-5 icon-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  </button>
  <div class="sidebar-overlay" onclick="toggleSidebar()"></div>
  <div class="flex min-h-screen relative">
${renderSidebar(opts.activePage)}
    <main id="main-content" class="flex-1 p-8 min-w-0 max-w-4xl">
${content}
    </main>
  </div>
</body>
</html>`;
}
