import { join } from "https://deno.land/std/path/mod.ts";
import { exists } from "https://deno.land/std/fs/mod.ts";
import { wrapInLayout } from "./src/layout.ts";

const PORT = 8000;
const ROOT = Deno.cwd();

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
};

// --- Static file serving ---

async function serveStatic(path: string): Promise<Response | null> {
  const filePath = join(ROOT, "public", path);
  if (await exists(filePath)) {
    const content = await Deno.readFile(filePath);
    const ext = filePath.split(".").pop() || "";
    const contentType = MIME_TYPES[`.${ext}`] || "application/octet-stream";
    return new Response(content, {
      headers: { "content-type": contentType },
    });
  }
  return null;
}

// --- Page serving ---

async function servePage(
  pageName: string,
  opts: { title: string; activePage: string; description?: string; htmx?: boolean },
): Promise<Response> {
  const filePath = join(ROOT, "src", "pages", `${pageName}.html`);
  try {
    const content = await Deno.readTextFile(filePath);
    const fullPage = wrapInLayout(content, opts);
    return new Response(fullPage, {
      headers: { "content-type": "text/html" },
    });
  } catch {
    return new Response("Page not found", { status: 404 });
  }
}

async function serveBlogFragment(
  category: string,
  slug: string,
  isHtmxRequest: boolean,
): Promise<Response> {
  const filePath = join(ROOT, "public", "blog", category, `${slug}.html`);
  try {
    const fragment = await Deno.readTextFile(filePath);
    if (isHtmxRequest) {
      return new Response(fragment, {
        headers: { "content-type": "text/html" },
      });
    }
    const titleMatch = fragment.match(/data-page-title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : slug;
    const fullPage = wrapInLayout(fragment, {
      title,
      activePage: "blog",
      htmx: true,
    });
    return new Response(fullPage, {
      headers: { "content-type": "text/html" },
    });
  } catch {
    return new Response("Blog post not found", { status: 404 });
  }
}

// --- Route table ---

type RouteHandler = (
  req: Request,
  match: RegExpMatchArray,
) => Response | Promise<Response>;

interface Route {
  pattern: RegExp;
  handler: RouteHandler;
}

const routes: Route[] = [
  // Static files
  {
    pattern: /^\/(css|assets|js)\/(.*)/,
    handler: async (_req, match) => {
      const path = `/${match[1]}/${match[2]}`;
      const res = await serveStatic(path);
      return res || new Response("Not found", { status: 404 });
    },
  },
  // Blog index JSON
  {
    pattern: /^\/blog\/index\.json$/,
    handler: async () => {
      const res = await serveStatic("blog/index.json");
      return res || new Response("Not found", { status: 404 });
    },
  },
  // Blog post fragment
  {
    pattern: /^\/blog\/([a-zA-Z_-]+)\/([a-zA-Z0-9_-]+)$/,
    handler: (req, match) => {
      const category = match[1];
      const slug = match[2];
      const isHtmx = req.headers.get("HX-Request") === "true";
      return serveBlogFragment(category, slug, isHtmx);
    },
  },
  // Home page
  {
    pattern: /^\/$/,
    handler: () =>
      servePage("index", { title: "Home", activePage: "home" }),
  },
  // About page
  {
    pattern: /^\/about$/,
    handler: () =>
      servePage("about", { title: "About", activePage: "about" }),
  },
  // Blog listing (also handles /blog/{category})
  {
    pattern: /^\/blog(\/[a-zA-Z_-]+)?$/,
    handler: () =>
      servePage("blog", {
        title: "Blog",
        activePage: "blog",
        htmx: true,
      }),
  },
  // Resume download
  {
    pattern: /^\/resume\.pdf$/,
    handler: async () => {
      const resumePath = join(ROOT, "public", "assets", "resume.pdf");
      try {
        const content = await Deno.readFile(resumePath);
        return new Response(content, {
          headers: {
            "content-type": "application/pdf",
            "content-disposition": 'attachment; filename="resume.pdf"',
          },
        });
      } catch {
        return new Response("Resume not found", { status: 404 });
      }
    },
  },
];

// --- Server ---

Deno.serve(async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const path = url.pathname;

  for (const route of routes) {
    const match = path.match(route.pattern);
    if (match) {
      return route.handler(req, match);
    }
  }

  return new Response("Not Found", { status: 404 });
}, { port: PORT });

console.log(`Server running at http://localhost:${PORT}`);
