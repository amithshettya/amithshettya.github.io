import { Marked } from "marked";
import { join } from "https://deno.land/std/path/mod.ts";
import { BLOG_CATEGORIES } from "./src/config.ts";

const ROOT = Deno.cwd();
const BLOG_SRC = join(ROOT, "src", "content", "blog");
const BLOG_OUT = join(ROOT, "public", "blog");

const marked = new Marked();

interface PostMeta {
  title: string;
  date: string;
  category: string;
  slug: string;
  description: string;
}

function parseFrontmatter(content: string): { meta: Record<string, string>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...val] = line.split(":");
    if (key && val.length) meta[key.trim()] = val.join(":").trim().replace(/^["']|["']$/g, "");
  });
  return { meta, body: match[2] };
}

function renderFragment(category: string, date: string, title: string, htmlBody: string): string {
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

async function ensureDir(dir: string) {
  try {
    await Deno.mkdir(dir, { recursive: true });
  } catch {
    // already exists
  }
}

async function build() {
  const posts: PostMeta[] = [];

  for (const { slug: cat } of BLOG_CATEGORIES) {
    const catDir = join(BLOG_SRC, cat);
    await ensureDir(join(BLOG_OUT, cat));

    try {
      for await (const entry of Deno.readDir(catDir)) {
        if (!entry.isFile || !entry.name.endsWith(".md")) continue;

        const filePath = join(catDir, entry.name);
        const raw = await Deno.readTextFile(filePath);
        const { meta, body } = parseFrontmatter(raw);
        const slug = entry.name.replace(/\.md$/, "");
        const title = meta.title || slug;
        const date = meta.date || "";
        const description = meta.description || "";

        let htmlBody = await marked.parse(body);
        const firstH1 = `<h1>${title}</h1>`;
        if (htmlBody.trimStart().startsWith(firstH1)) {
          htmlBody = htmlBody.trimStart().slice(firstH1.length);
        }
        const fragment = renderFragment(cat, date, title, htmlBody);
        const outPath = join(BLOG_OUT, cat, `${slug}.html`);
        await Deno.writeTextFile(outPath, fragment);

        posts.push({ title, date, category: cat, slug, description });
      }
    } catch {
      // directory may not exist
    }
  }

  posts.sort((a, b) => b.date.localeCompare(a.date));

  await ensureDir(BLOG_OUT);
  await Deno.writeTextFile(
    join(BLOG_OUT, "index.json"),
    JSON.stringify({ posts, categories: BLOG_CATEGORIES }, null, 2)
  );

  console.log(`Built ${posts.length} blog post(s) to public/blog/`);
}

build();
