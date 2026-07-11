import { BLOG_CATEGORIES, NAV_LINKS } from "./config.mjs";

const CHEVRON_SVG = `<svg class="sidebar-chevron w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

export function renderSidebar(activePage) {
  const nonBlogLinks = NAV_LINKS.filter(({ page }) => page !== "blog");
  const navHtml = nonBlogLinks.map(({ href, label, page }) => {
    const isActive = activePage === page;
    const classes = isActive ? "sidebar-link sidebar-link-active" : "sidebar-link";
    const aria = isActive ? ' aria-current="page"' : "";
    return `        <a href="${href}" class="${classes}"${aria}>${label}</a>`;
  }).join("\n");

  const isBlogPage = activePage === "blog";
  const blogActiveClass = isBlogPage ? " sidebar-link-active" : "";
  const blogAria = isBlogPage ? ' aria-current="page"' : "";

  const categoryHtml = BLOG_CATEGORIES.map(({ slug, name }) =>
    `          <div class="sidebar-category" data-category-slug="${slug}">
            <div class="category-header">
              <a href="/blog/${slug}/" class="category-name">${name}</a>
              <button class="category-toggle-btn" onclick="event.stopPropagation();toggleCategory('${slug}')" aria-label="Toggle ${name} posts" aria-expanded="false">
                ${CHEVRON_SVG}
              </button>
            </div>
            <div class="sidebar-subposts"></div>
          </div>`
  ).join("\n");

  return `    <aside class="sidebar-nav w-64 border-r border-grid-strong bg-ground/80 backdrop-blur-sm p-6 flex flex-col relative z-40 shrink-0 dark:bg-dark-ground/80 dark:border-dark-grid-strong">
      <div class="mb-8">
        <p class="font-grotesk text-xl font-medium tracking-wide text-ink dark:text-dark-ink">Amith Shetty</p>
        <p class="text-sm text-ink-soft dark:text-dark-ink-soft font-grotesk">Software Engineer</p>
      </div>
      <nav class="space-y-1" aria-label="Main navigation">
${navHtml}
        <div class="blog-section expanded">
          <div class="blog-section-header">
            <a href="/blog" class="sidebar-link flex-1${blogActiveClass}"${blogAria}>Blog</a>
            <button class="blog-toggle-btn" onclick="toggleBlogSection()" aria-label="Toggle blog categories" aria-expanded="true">
              ${CHEVRON_SVG}
            </button>
          </div>
          <div class="blog-section-categories">
${categoryHtml}
          </div>
        </div>
      </nav>
    </aside>`;
}

export function wrapInLayout(content, opts) {
  const metaDesc =
    opts.description ||
    "Amith Shetty - Software engineer working on networking and distributed systems.";
  const htmxScript = opts.htmx
    ? '\n  <script src="https://unpkg.com/htmx.org@1.9.10"></script>'
    : "";
  const blogScript = opts.activePage === "blog"
    ? '\n  <script src="/js/blog.js"></script>'
    : "";
  const homeScript = opts.activePage === "home"
    ? '\n  <script src="/js/home.js"></script>'
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
  <script src="/js/sidebar.js"></script>${blogScript}${homeScript}
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
    <main id="main-content" class="flex-1 p-8 min-w-0 max-w-[1080px]">
${content}
    </main>
  </div>
</body>
</html>`;
}
