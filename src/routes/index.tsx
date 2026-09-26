import { createFileRoute } from "@tanstack/react-router";
import { NetworkPrototype } from "@/components/worlds/NetworkPrototype";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Worlds Together | International student network" },
      {
        name: "description",
        content:
          "An intercollegiate network for international students to make introductions, exchange housing and travel help, and join private conversations.",
      },
      {
        property: "og:title",
        content: "Worlds Together | International student network",
      },
      {
        property: "og:description",
        content:
          "Meet beyond your campus, exchange practical help, and join private conversations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NetworkPrototype,
});
