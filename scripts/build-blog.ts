import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Marked } from "marked";
import { BLOG_CATEGORIES } from "../src/lib/config.ts";

const ROOT = process.cwd();
const BLOG_SRC = join(ROOT, "src", "content", "blog");
const GENERATED = join(ROOT, "src", "generated");
const PUBLIC = join(ROOT, "public");

const marked = new Marked();

function ensureDir(dir: string) {
  mkdirSync(dir, { recursive: true });
}

function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {} as Record<string, string>, body: content };
  const meta: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...val] = line.split(":");
    if (key && val.length)
      meta[key.trim()] = val.join(":").trim().replace(/^["']|["']$/g, "");
  });
  return { meta, body: match[2] };
}

async function buildBlogPosts() {
  const posts: Array<{
    title: string;
    date: string;
    category: string;
    slug: string;
    description: string;
    featured: boolean;
    content: string;
  }> = [];

  for (const { slug: cat } of BLOG_CATEGORIES) {
    const catDir = join(BLOG_SRC, cat);

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

        posts.push({
          title,
          date,
          category: cat,
          slug,
          description,
          featured,
          content: htmlBody,
        });
      }
    } catch {
      // directory may not exist
    }
  }

  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

function generateTypeScript(posts: Awaited<ReturnType<typeof buildBlogPosts>>) {
  const postInterface = `export interface BlogPost {
  title: string;
  date: string;
  category: string;
  slug: string;
  description: string;
  featured: boolean;
  content: string;
}`;

  const postsData = `export const posts: BlogPost[] = ${JSON.stringify(posts, null, 2)};`;

  return `${postInterface}\n\n${postsData}\n`;
}

function generateIndexJson(
  posts: Awaited<ReturnType<typeof buildBlogPosts>>
) {
  const postsMeta = posts.map(({ content: _, ...rest }) => rest);
  return JSON.stringify({ posts: postsMeta, categories: BLOG_CATEGORIES }, null, 2);
}

async function build() {
  ensureDir(GENERATED);
  ensureDir(join(PUBLIC, "blog"));

  const posts = await buildBlogPosts();

  writeFileSync(join(GENERATED, "blog-posts.ts"), generateTypeScript(posts), "utf-8");
  writeFileSync(join(PUBLIC, "blog", "index.json"), generateIndexJson(posts), "utf-8");

  console.log(
    `Built ${posts.length} blog post(s) + ${BLOG_CATEGORIES.length} categories`
  );
}

build();
