import { createFileRoute } from "@tanstack/react-router";

const TECH_TAGS = [
  "C",
  "C++",
  "Rust",
  "Go",
  "Python",
  "eBPF",
  "BGP",
  "IPsec",
  "GRE",
  "Kafka",
  "PostgreSQL",
];

function AboutComponent() {
  return (
    <>
      <p className="eyebrow-hand mb-1">about</p>
      <h1 className="page-heading text-ink dark:text-dark-ink">About Me</h1>

      <div className="prose dark:text-dark-ink mt-8">
        <p className="mb-4">
          I&apos;m a software engineer. I like understanding how things work,
          from the logic gates in a processor to the emergent behavior of
          global systems.
        </p>
        <p className="mb-4">
          My interests sit across computer and software architecture, physics,
          mathematics, and systems thinking. I end up tracing ideas between
          these fields a lot. Principles from one domain have a way of
          explaining something in another.
        </p>
        <p className="mb-4">
          Outside of software, I follow economics and geopolitics. I got into
          them because the same patterns from distributed systems keep showing
          up. Markets, governments, packet flows. Same ideas, different names.
        </p>
      </div>

      <h2 className="section-heading mt-12 mb-6">Beyond the screen</h2>
      <div className="prose dark:text-dark-ink">
        <p className="mb-4">
          When I&apos;m not at a computer, I play chess. I hike and travel
          when I can, and I work out regularly. I want to build things that
          give people time back and make a messy world a little easier to
          navigate.
        </p>
      </div>

      <h2 className="section-heading mt-12 mb-6">Technologies</h2>

      <div className="marquee-wrap relative overflow-hidden rounded-lg border border-grid-strong dark:border-dark-grid-strong">
        <div className="marquee-track flex gap-4 py-4">
          {[...TECH_TAGS, ...TECH_TAGS].map((tech, i) => (
            <span
              key={i}
              className="marquee-tag shrink-0 font-mono text-sm text-accent dark:text-dark-accent px-4 py-2 rounded-full border border-accent/15 dark:border-dark-accent/15 bg-accent/5 dark:bg-dark-accent/5"
            >
              {tech}
            </span>
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ground dark:from-dark-ground to-transparent z-10"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ground dark:from-dark-ground to-transparent z-10"
        />
      </div>
    </>
  );
}

export const Route = createFileRoute("/about")({
  component: AboutComponent,
});
