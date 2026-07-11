import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { BlogListing } from "@/components/BlogListing";
import { BLOG_CATEGORIES } from "@/lib/config";

function BlogCategoryComponent() {
  const { category } = Route.useParams();
  const categoryName =
    BLOG_CATEGORIES.find((c) => c.slug === category)?.name || category;
  const { resolvedLocation } = useRouterState();

  if (resolvedLocation?.pathname !== `/blog/${category}`) {
    return <Outlet />;
  }

  return <BlogListing category={category} categoryName={categoryName} />;
}

export const Route = createFileRoute("/blog/$category")({
  component: BlogCategoryComponent,
});
