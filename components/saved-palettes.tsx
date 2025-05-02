"use client"

import { Star, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ColorPalette {
  id: string
  name: string
  colors: string[]
  tags: string[]
  favorite: boolean
  createdAt: number
}

interface SavedPalettesProps {
  palettes: ColorPalette[]
  onLoad: (palette: ColorPalette) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export default function SavedPalettes({ palettes, onLoad, onDelete, onToggleFavorite }: SavedPalettesProps) {
  if (palettes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">No saved palettes yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {palettes.map((palette) => (
        <Card
          key={palette.id}
          className="backdrop-blur-sm bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/20 overflow-hidden transition-all duration-300 hover:shadow-lg"
        >
          <div className="h-16 flex">
            {palette.colors.map((color, index) => (
              <div key={index} className="flex-1 h-full" style={{ backgroundColor: color }} />
            ))}
          </div>

          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg truncate pr-2">{palette.name}</h3>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleFavorite(palette.id)}
                className={palette.favorite ? "text-amber-500" : ""}
              >
                <Star className="h-5 w-5" fill={palette.favorite ? "currentColor" : "none"} />
              </Button>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {palette.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <Button variant="destructive" size="sm" onClick={() => onDelete(palette.id)}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>

              <Button variant="outline" size="sm" onClick={() => onLoad(palette)}>
                <ExternalLink className="h-4 w-4 mr-1" /> Load
              </Button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              Created {new Date(palette.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
