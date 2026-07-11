import { render, screen } from "@testing-library/react";
import { createRouter, createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { describe, it, expect } from "vitest";
import { routeTree } from "@/routeTree.gen";

function renderRoute(path: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  return render(<RouterProvider router={router} />);
}

describe("Blog routing", () => {
  it("renders blog listing on /blog", async () => {
    renderRoute("/blog");
    expect(await screen.findByText("blog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Blog" })).toBeInTheDocument();
  });

  it("renders filtered blog listing on /blog?category=computer-networks", async () => {
    renderRoute("/blog?category=computer-networks");
    expect(await screen.findByText("blog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Blog" })).toBeInTheDocument();
  });

  it("renders category listing on /blog/$category", async () => {
    renderRoute("/blog/computer-networks");
    expect(await screen.findByText("blog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Computer Networks" })).toBeInTheDocument();
  });

  it("renders blog post content on /blog/$category/$slug", async () => {
    renderRoute("/blog/computer-networks/tcp-handshake");
    expect(await screen.findByRole("heading", { name: "How the TCP Handshake Actually Works" })).toBeInTheDocument();
    expect(screen.getByText(/Every web request begins with a TCP three-way handshake/)).toBeInTheDocument();
  });

  it("renders post not found for invalid slug", async () => {
    renderRoute("/blog/computer-networks/nonexistent-post");
    expect(await screen.findByText("Post not found.")).toBeInTheDocument();
  });

  it("renders post not found for invalid category", async () => {
    renderRoute("/blog/nonexistent-category/some-slug");
    expect(await screen.findByText("Post not found.")).toBeInTheDocument();
  });
});
