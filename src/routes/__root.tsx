import { createRootRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

function RootComponent() {
  return <Layout />;
}

export const Route = createRootRoute({
  component: RootComponent,
});
