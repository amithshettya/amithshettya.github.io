import { Link } from "@tanstack/react-router";
import { BLOG_CATEGORIES } from "@/lib/config";
import { posts } from "@/generated/blog-posts";

interface CategoryPillsProps {
  currentCategory?: string;
}

export function CategoryPills({ currentCategory = "all" }: CategoryPillsProps) {
  return (
    <div className="category-filters flex flex-wrap gap-3 mt-8 mb-10">
      <Link
        to="/blog"
        className={`pill ${currentCategory === "all" ? "pill-active" : ""}`}
      >
        All <span className="pill-count">({posts.length})</span>
      </Link>
      {BLOG_CATEGORIES.map(({ slug, name }) => {
        const count = posts.filter((p) => p.category === slug).length;
        return (
          <Link
            key={slug}
            to="/blog"
            search={() => ({ category: slug })}
            className={`pill ${currentCategory === slug ? "pill-active" : ""}`}
          >
            {name} <span className="pill-count">({count})</span>
          </Link>
        );
      })}
    </div>
  );
}
