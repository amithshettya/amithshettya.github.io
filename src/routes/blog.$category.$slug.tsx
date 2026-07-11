import { createFileRoute, Link } from "@tanstack/react-router";
import { posts } from "@/generated/blog-posts";
import { estimateReadingTime } from "@/lib/config";

function BlogPostComponent() {
  const { category, slug } = Route.useParams();
  const post = posts.find((p) => p.category === category && p.slug === slug);

  if (!post) {
    return (
      <div className="prose dark:text-dark-ink">
        <p>Post not found.</p>
        <Link
          to="/blog"
          className="text-accent dark:text-dark-accent"
        >
          &larr; Back to blog
        </Link>
      </div>
    );
  }

  const readingTime = estimateReadingTime(post.content);

  const currentIndex = posts.findIndex(
    (p) => p.category === category && p.slug === slug
  );
  const prev = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const next = currentIndex > 0 ? posts[currentIndex - 1] : null;

  return (
    <article className="prose" data-page-title={post.title}>
      <div className="flex items-center gap-3 mb-4">
        <span className="eyebrow-hand-sm">{post.category}</span>
        <span className="text-grid-strong dark:text-dark-grid-strong">
          &bull;
        </span>
        <time className="font-mono text-sm text-ink-soft dark:text-dark-ink-soft">
          {post.date}
        </time>
        <span className="text-grid-strong dark:text-dark-grid-strong">
          &bull;
        </span>
        <span className="reading-time">{readingTime}</span>
      </div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      {(prev || next) && (
        <nav className="docs-prevnext" aria-label="Previous/next post">
          <div>
            {prev && (
              <Link
                to="/blog/$category/$slug"
                params={{ category: prev.category, slug: prev.slug }}
              >
                <span className="dir">&larr; Previous</span>
                {prev.title}
              </Link>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            {next && (
              <Link
                to="/blog/$category/$slug"
                params={{ category: next.category, slug: next.slug }}
              >
                <span className="dir">Next &rarr;</span>
                {next.title}
              </Link>
            )}
          </div>
        </nav>
      )}
    </article>
  );
}

export const Route = createFileRoute("/blog/$category/$slug")({
  component: BlogPostComponent,
});
