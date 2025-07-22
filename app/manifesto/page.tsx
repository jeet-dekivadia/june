import { ManifestoCard } from "@/components/manifesto-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manifesto | June - Welcome to the Future of Dating",
  description:
    "Why we're building the future of dating. Our mission to transform how people find love through AI-powered connections and meaningful conversations.",
}

export default function Manifesto() {
  return <ManifestoCard />
}
