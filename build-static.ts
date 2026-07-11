import { join, dirname } from "https://deno.land/std/path/mod.ts";
import { wrapInLayout } from "./src/layout.ts";
import { BLOG_CATEGORIES } from "./src/config.ts";

const ROOT = Deno.cwd();
const SITE_DIR = join(ROOT, "_site");

async function ensureDir(dir: string) {
  await Deno.mkdir(dir, { recursive: true });
}

async function copyDir(src: string, dest: string) {
  await ensureDir(dest);
  for await (const entry of Deno.readDir(src)) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile) {
      await Deno.copyFile(srcPath, destPath);
    }
  }
}

async function writePage(relPath: string, content: string) {
  const fullPath = join(SITE_DIR, relPath);
  await ensureDir(dirname(fullPath));
  await Deno.writeTextFile(fullPath, content);
}

async function buildPages() {
  console.log("Building static pages...");

  // Home
  const indexContent = await Deno.readTextFile(join(ROOT, "src", "pages", "index.html"));
  await writePage("index.html", wrapInLayout(indexContent, { title: "Home", activePage: "home" }));
  console.log("  / (home)");

  // About
  const aboutContent = await Deno.readTextFile(join(ROOT, "src", "pages", "about.html"));
  await writePage("about/index.html", wrapInLayout(aboutContent, { title: "About", activePage: "about" }));
  console.log("  /about");

  // Blog listing
  const blogContent = await Deno.readTextFile(join(ROOT, "src", "pages", "blog.html"));
  await writePage("blog/index.html", wrapInLayout(blogContent, {
    title: "Blog",
    activePage: "blog",
    htmx: true,
  }));
  console.log("  /blog");
}

async function buildBlogPosts() {
  console.log("Building blog posts...");

  let count = 0;

  for (const { slug: category } of BLOG_CATEGORIES) {
    const catDir = join(ROOT, "public", "blog", category);

    try {
      for await (const entry of Deno.readDir(catDir)) {
        if (!entry.isFile || !entry.name.endsWith(".html")) continue;

        const slug = entry.name.replace(/\.html$/, "");
        const fragment = await Deno.readTextFile(join(catDir, entry.name));

        // Extract title from data-page-title attribute
        const titleMatch = fragment.match(/data-page-title="([^"]+)"/);
        const title = titleMatch ? titleMatch[1] : slug;

        // Write full page for direct navigation
        const fullPage = wrapInLayout(fragment, {
          title,
          activePage: "blog",
          htmx: true,
        });
        await writePage(`blog/${category}/${slug}/index.html`, fullPage);

        // Write fragment for HTMX requests
        await writePage(`blog/${category}/${slug}.html`, fragment);

        count++;
        console.log(`  /blog/${category}/${slug}`);
      }
    } catch {
      // directory may not exist
    }
  }

  console.log(`  Built ${count} blog post(s)`);
}

async function copyAssets() {
  console.log("Copying assets...");

  // CSS
  await copyDir(join(ROOT, "public", "css"), join(SITE_DIR, "css"));
  console.log("  css/");

  // JS
  await copyDir(join(ROOT, "public", "js"), join(SITE_DIR, "js"));
  console.log("  js/");

  // Assets
  await copyDir(join(ROOT, "public", "assets"), join(SITE_DIR, "assets"));
  console.log("  assets/");

  // Blog index.json and categories.json
  await ensureDir(join(SITE_DIR, "blog"));
  try {
    await Deno.copyFile(
      join(ROOT, "public", "blog", "index.json"),
      join(SITE_DIR, "blog", "index.json")
    );
    console.log("  blog/index.json");
  } catch {
    // may not exist
  }
  try {
    await Deno.copyFile(
      join(ROOT, "public", "blog", "categories.json"),
      join(SITE_DIR, "blog", "categories.json")
    );
    console.log("  blog/categories.json");
  } catch {
    // may not exist
  }
}

async function build() {
  const start = performance.now();

  // Clean _site
  try {
    await Deno.remove(SITE_DIR, { recursive: true });
  } catch {
    // may not exist
  }
  await ensureDir(SITE_DIR);

  await buildPages();
  await buildBlogPosts();
  await copyAssets();

  const elapsed = ((performance.now() - start) / 1000).toFixed(2);
  console.log(`\nStatic site built to _site/ in ${elapsed}s`);
}

build();
