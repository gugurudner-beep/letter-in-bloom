import { createFileRoute } from "@tanstack/react-router";

import { KeepsakeExperience } from "@/components/keepsake/KeepsakeExperience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Uma carta para você — envelope, Polaroid e carta" },
      {
        name: "description",
        content: "Abra o envelope selado, revele a Polaroid e leia uma carta escrita com calma.",
      },
      { property: "og:title", content: "Uma carta para você" },
      {
        property: "og:description",
        content: "Abra o envelope selado, revele a Polaroid e leia uma carta escrita com calma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <KeepsakeExperience />;
}
