import { Link } from "@tanstack/react-router";
import { BLOG_CATEGORIES } from "@/lib/config";

interface BlogPostCardProps {
  title: string;
  date: string;
  category: string;
  slug: string;
  description: string;
  featured?: boolean;
  variant?: "default" | "featured";
  readingTime?: string;
}

export function BlogPostCard({
  title,
  date,
  category,
  slug,
  description,
  featured,
  variant = "default",
  readingTime,
}: BlogPostCardProps) {
  const cardClass = variant === "featured" ? "card-featured group" : "card p-6 group";
  const categoryName = BLOG_CATEGORIES.find((c) => c.slug === category)?.name ?? category;

  return (
    <article className={`${cardClass} relative`}>
      <Link
        to="/blog/$category/$slug"
        params={{ category, slug }}
        className="absolute inset-0 z-10 block"
        aria-label={title}
      />
      <div className="flex items-center gap-3 mb-3">
        <span className="eyebrow-hand-sm">{categoryName}</span>
        <span className="text-grid-strong dark:text-dark-grid-strong">&bull;</span>
        <time className="font-mono text-sm text-ink-soft dark:text-dark-ink-soft">
          {date}
        </time>
        {readingTime && (
          <>
            <span className="text-grid-strong dark:text-dark-grid-strong">&bull;</span>
            <span className="reading-time">{readingTime}</span>
          </>
        )}
        {(featured || variant === "featured") && (
          <span className="badge badge-accent">Featured</span>
        )}
      </div>
      <h3 className="font-serif text-xl text-ink dark:text-dark-ink group-hover:text-accent dark:group-hover:text-dark-accent transition-colors">
        {title}
      </h3>
      <p className={`text-ink-soft dark:text-dark-ink-soft mt-2${variant === "featured" ? " text-lg" : ""}`}>
        {description}
      </p>
    </article>
  );
}
