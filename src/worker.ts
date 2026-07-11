import { wrapInLayout } from "./layout.ts";
import homeHtml from "./pages/index.html";
import aboutHtml from "./pages/about.html";
import blogHtml from "./pages/blog.html";

interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const isHtmx = request.headers.get("HX-Request") === "true";

    // Blog post — fetch fragment from assets, maybe wrap in layout
    const blogPostMatch = path.match(/^\/blog\/([a-zA-Z_-]+)\/([a-zA-Z0-9_-]+)\/?$/);
    if (blogPostMatch) {
      const [, category, slug] = blogPostMatch;
      const fragRes = await env.ASSETS.fetch(
        new URL(`/blog/${category}/${slug}.html`, url.origin)
      );
      if (!fragRes.ok) return new Response("Not found", { status: 404 });
      if (isHtmx) return fragRes;
      const fragment = await fragRes.text();
      const titleMatch = fragment.match(/data-page-title="([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : slug;
      return htmlResponse(wrapInLayout(fragment, { title, activePage: "blog", htmx: true }));
    }

    // Static page routes
    switch (path) {
      case "/":
        return htmlResponse(wrapInLayout(homeHtml, { title: "Home", activePage: "home" }));
      case "/about":
        return htmlResponse(wrapInLayout(aboutHtml, { title: "About", activePage: "about" }));
      case "/blog":
      case "/blog/":
        return htmlResponse(wrapInLayout(blogHtml, { title: "Blog", activePage: "blog", htmx: true }));
      default:
        // Resume download — serve with attachment header
        if (path === "/resume.pdf") {
          const assetRes = await env.ASSETS.fetch(new URL("/assets/resume.pdf", url.origin));
          if (!assetRes.ok) return new Response("Not found", { status: 404 });
          const body = await assetRes.arrayBuffer();
          return new Response(body, {
            headers: {
              "content-type": "application/pdf",
              "content-disposition": 'attachment; filename="resume.pdf"',
            },
          });
        }
        // Everything else — delegate to static assets
        return env.ASSETS.fetch(request);
    }
  },
};

function htmlResponse(html: string): Response {
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
