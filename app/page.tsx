import type { Metadata } from "next"
import ColorPaletteGenerator from "@/components/color-palette-generator"

export const metadata: Metadata = {
  title: "Modern Color Palette Generator",
  description: "A Moroccan-inspired color palette generator with AI suggestions",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
      <ColorPaletteGenerator />
    </main>
  )
}
