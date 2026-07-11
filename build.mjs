import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync } from "node:fs";
import { join } from "node:path";
import { Marked } from "marked";
import { BLOG_CATEGORIES } from "./src/config.mjs";
import { wrapInLayout } from "./src/layout.mjs";

const ROOT = process.cwd();
const BLOG_SRC = join(ROOT, "src", "content", "blog");
const PUBLIC = join(ROOT, "public");
const BLOG_OUT = join(PUBLIC, "blog");
const PAGES_SRC = join(ROOT, "src", "pages");

const marked = new Marked();

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...val] = line.split(":");
    if (key && val.length) meta[key.trim()] = val.join(":").trim().replace(/^["']|["']$/g, "");
  });
  return { meta, body: match[2] };
}

function renderFragment(category, date, title, htmlBody) {
  return `<article class="prose" data-page-title="${title}">
  <div class="flex items-center gap-3 mb-4">
    <span class="eyebrow-hand-sm">${category}</span>
    <span class="text-grid-strong dark:text-dark-grid-strong">&bull;</span>
    <time class="font-mono text-sm text-ink-soft dark:text-dark-ink-soft">${date}</time>
  </div>
  <h1>${title}</h1>
  ${htmlBody}
</article>`;
}

async function buildBlogPosts() {
  const posts = [];

  for (const { slug: cat } of BLOG_CATEGORIES) {
    const catDir = join(BLOG_SRC, cat);
    ensureDir(join(BLOG_OUT, cat));

    try {
      const entries = readdirSync(catDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

        const filePath = join(catDir, entry.name);
        const raw = readFileSync(filePath, "utf-8");
        const { meta, body } = parseFrontmatter(raw);
        const slug = entry.name.replace(/\.md$/, "");
        const title = meta.title || slug;
        const date = meta.date || "";
        const description = meta.description || "";
        const featured = meta.featured === "true";

        let htmlBody = await marked.parse(body);
        const firstH1 = `<h1>${title}</h1>`;
        if (htmlBody.trimStart().startsWith(firstH1)) {
          htmlBody = htmlBody.trimStart().slice(firstH1.length);
        }

        // Fragment for HTMX swaps
        const fragment = renderFragment(cat, date, title, htmlBody);
        writeFileSync(join(BLOG_OUT, cat, `${slug}.html`), fragment, "utf-8");

        // Full page for direct navigation
        const fullPage = wrapInLayout(fragment, { title, activePage: "blog", htmx: true });
        ensureDir(join(BLOG_OUT, cat, slug));
        writeFileSync(join(BLOG_OUT, cat, slug, "index.html"), fullPage, "utf-8");

        posts.push({ title, date, category: cat, slug, description, featured });
      }
    } catch {
      // directory may not exist
    }
  }

  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

function buildCategoryListings() {
  const blogHtml = readFileSync(join(PAGES_SRC, "blog.html"), "utf-8");
  const fullPage = wrapInLayout(blogHtml, { title: "Blog", activePage: "blog", htmx: true });

  ensureDir(BLOG_OUT);
  writeFileSync(join(BLOG_OUT, "index.html"), fullPage, "utf-8");

  for (const { slug } of BLOG_CATEGORIES) {
    ensureDir(join(BLOG_OUT, slug));
    writeFileSync(join(BLOG_OUT, slug, "index.html"), fullPage, "utf-8");
  }
}

function buildStaticPages() {
  const pages = [
    { file: "index.html", title: "Home", activePage: "home", htmx: false },
    { file: "about.html", title: "About", activePage: "about", htmx: false },
  ];

  for (const { file, title, activePage, htmx } of pages) {
    const content = readFileSync(join(PAGES_SRC, file), "utf-8");
    const fullPage = wrapInLayout(content, { title, activePage, htmx });
    writeFileSync(join(PUBLIC, file), fullPage, "utf-8");
  }
}

async function build() {
  ensureDir(PUBLIC);

  const posts = await buildBlogPosts();
  buildCategoryListings();
  buildStaticPages();

  ensureDir(BLOG_OUT);
  writeFileSync(
    join(BLOG_OUT, "index.json"),
    JSON.stringify({ posts, categories: BLOG_CATEGORIES }, null, 2),
    "utf-8"
  );

  console.log(`Built ${posts.length} blog post(s) + ${BLOG_CATEGORIES.length} category pages + 3 static pages`);
}

build();
