import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { BlogListing } from "@/components/BlogListing";

function BlogComponent() {
  const search = Route.useSearch() as Record<string, string>;
  const category = search.category || "all";
  const { resolvedLocation } = useRouterState();

  if (resolvedLocation?.pathname !== "/blog") {
    return <Outlet />;
  }

  return <BlogListing category={category} categoryName="Blog" />;
}

export const Route = createFileRoute("/blog")({
  component: BlogComponent,
});
