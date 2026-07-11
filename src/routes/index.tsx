import { createFileRoute } from "@tanstack/react-router";
import { posts } from "@/generated/blog-posts";
import { estimateReadingTime } from "@/lib/config";
import { BlogPostCard } from "@/components/BlogPostCard";

function HomeComponent() {
  const featured = posts.filter((p) => p.featured);

  return (
    <>
      <section className="mb-16">
        <p className="eyebrow-hand mb-1">hello world</p>
        <h1 className="hero-heading text-ink dark:text-dark-ink">
          Hello, I&apos;m{" "}
          <span className="text-accent dark:text-dark-accent">Amith</span>
        </h1>
        <p className="lede-text mt-6 text-ink dark:text-dark-ink">
          A software engineer trying to build a better internet.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-8">
          <a href="/assets/resume.pdf" download className="star-cta">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Resume</span>
          </a>
          <a
            href="https://www.linkedin.com/in/amithshettya/"
            target="_blank"
            rel="noopener"
            className="star-cta"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="currentColor"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span>LinkedIn</span>
          </a>
          <a
            href="https://github.com/amithshettya"
            target="_blank"
            rel="noopener"
            className="star-cta"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              width="15"
              height="15"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 0C3.58.0.0 3.58.0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38.0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95.0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12.0.0.67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15.0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48.0 1.07-.01 1.93-.01 2.2.0.21.15.46.55.38A8.01 8.01.0 0016 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </section>

      <section className="mt-20 mb-16">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="section-num">01</span>
          <h2 className="section-heading">What I Do</h2>
        </div>
        <p className="lede-text text-ink dark:text-dark-ink">
          I build networking and distributed systems software. At Cloudflare I
          work on Magic WAN, which connects customer networks to our edge, and
          Magic Transit, which scrubs DDoS attacks before they reach the customer.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div className="card p-6">
            <h3 className="font-grotesk font-semibold text-base text-ink dark:text-dark-ink mb-2">
              Computer Networks
            </h3>
            <p className="text-ink-soft dark:text-dark-ink-soft text-sm leading-relaxed">
              Global routing, WAN architecture, DDoS mitigation. I build Magic
              WAN at Cloudflare, connecting customer networks to the edge
              through IPSec and GRE tunnels at scale.
            </p>
          </div>
          <div className="card p-6">
            <h3 className="font-grotesk font-semibold text-base text-ink dark:text-dark-ink mb-2">
              Distributed Systems
            </h3>
            <p className="text-ink-soft dark:text-dark-ink-soft text-sm leading-relaxed">
              Distributed tunneling across 330+ data centers. When a path
              breaks, traffic finds another before anything drops. If a
              connection can fail, it will, so I design for that.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-20 mb-16">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="section-num">02</span>
          <h2 className="section-heading">Blog</h2>
        </div>
        <p className="lede-text text-ink dark:text-dark-ink mb-8">
          Deep dives into the systems and ideas that shape my work.
        </p>
        <div className="space-y-4">
          {featured.map((post) => (
            <BlogPostCard key={post.slug} {...post} variant="featured" readingTime={estimateReadingTime(post.content)} />
          ))}
        </div>
      </section>
    </>
  );
}

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
