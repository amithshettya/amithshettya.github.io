import { posts } from "@/generated/blog-posts";
import { estimateReadingTime } from "@/lib/config";
import { BlogPostCard } from "./BlogPostCard";
import { CategoryPills } from "./CategoryPills";

interface BlogListingProps {
  category: string;
  categoryName: string;
}

export function BlogListing({ category, categoryName }: BlogListingProps) {
  const filtered =
    category === "all"
      ? posts
      : posts.filter((p) => p.category === category);

  return (
    <>
      <p className="eyebrow-hand mb-1">blog</p>
      <h1 className="page-heading text-ink dark:text-dark-ink">
        {categoryName}
      </h1>

      <CategoryPills currentCategory={category} />

      <div className="space-y-6">
        {filtered.length === 0 ? (
          <p className="text-ink-soft dark:text-dark-ink-soft italic">
            No posts found.
          </p>
        ) : (
          filtered.map((post) => <BlogPostCard key={post.slug} {...post} readingTime={estimateReadingTime(post.content)} />)
        )}
      </div>
    </>
  );
}
