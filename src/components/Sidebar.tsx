import { BLOG_CATEGORIES, NAV_LINKS } from "@/lib/config";
import { useLocation, Link } from "@tanstack/react-router";
import { useSidebarStore } from "@/stores/sidebar";
import { posts } from "@/generated/blog-posts";

const ChevronSvg = () => (
  <svg
    className="sidebar-chevron w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export function Sidebar() {
  const location = useLocation();
  const { isOpen, close } = useSidebarStore();

  const path = location.pathname.replace(/\/+$/, "");
  const searchParams = new URLSearchParams(location.search);
  const searchCategory = searchParams.get("category");

  const postMatch = path.match(/^\/blog\/([a-zA-Z_-]+)\/([a-zA-Z_-]+)$/);
  const activeCategory = postMatch ? postMatch[1] : null;
  const activeSlug = postMatch ? postMatch[2] : null;

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={close}
      />
      <aside
        className={`sidebar-nav w-64 border-r border-grid-strong bg-ground/80 backdrop-blur-sm p-6 flex flex-col relative z-40 shrink-0 dark:bg-dark-ground/80 dark:border-dark-grid-strong ${
          isOpen ? "open" : ""
        }`}
      >
        <div className="mb-8">
          <p className="font-grotesk text-xl font-medium tracking-wide text-ink dark:text-dark-ink">
            Amith Shetty
          </p>
          <p className="text-sm text-ink-soft dark:text-dark-ink-soft font-grotesk">
            Software Engineer
          </p>
        </div>
        <nav className="space-y-1" aria-label="Main navigation">
          {NAV_LINKS.filter(({ page }) => page !== "blog").map(
            ({ href, label, page }) => {
              const isActive =
                page === "home"
                  ? path === ""
                  : path === `/${page}`;
              const classes = isActive
                ? "sidebar-link sidebar-link-active"
                : "sidebar-link";
              return (
                <Link key={page} to={href} className={classes} onClick={close}>
                  {label}
                </Link>
              );
            }
          )}
          <Link
            to="/blog"
            className={`sidebar-link ${path.startsWith("/blog") ? "sidebar-link-active" : ""}`}
            onClick={close}
          >
            Blog
          </Link>
          <div className="pl-3 mt-1">
          {BLOG_CATEGORIES.map(({ slug, name }) => {
            const isExpanded =
              searchCategory === slug || activeCategory === slug;
            const isHighlighted =
              searchCategory === slug || (path.startsWith(`/blog/${slug}`) && !activeSlug);
            const categoryPosts = posts.filter((p) => p.category === slug);
            return (
              <div
                key={slug}
                className={`sidebar-category ${isExpanded ? "expanded" : ""}`}
                data-category-slug={slug}
              >
                <div className="category-header">
                  <Link
                    to="/blog"
                    search={() => ({ category: isExpanded ? undefined : slug })}
                    className={`category-name ${isHighlighted ? "category-active" : ""}`}
                    onClick={close}
                  >
                    {name}
                  </Link>
                  <ChevronSvg />
                </div>
                {isExpanded && (
                  <div className="sidebar-subposts">
                    {categoryPosts.map((post) => {
                      const isActive = post.slug === activeSlug;
                      return (
                        <Link
                          key={post.slug}
                          to="/blog/$category/$slug"
                          params={{
                            category: post.category,
                            slug: post.slug,
                          }}
                          className={`sidebar-subpost ${isActive ? "sidebar-subpost-active" : ""}`}
                          aria-current={isActive ? "page" : undefined}
                          onClick={close}
                        >
                          {post.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </nav>
      </aside>
    </>
  );
}
