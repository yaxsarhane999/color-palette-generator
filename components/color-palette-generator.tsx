"use client"

import { useState, useEffect } from "react"
import { Copy, RefreshCw, Lock, Unlock, Download, Save, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import AuthorFooter from "@/components/author-footer"
import MoroccanPattern from "@/components/moroccan-pattern"
import SavedPalettes from "@/components/saved-palettes"
import ExportOptions from "@/components/export-options"
import ContrastChecker from "@/components/contrast-checker"

// Color generation utilities
const generateRandomColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  )
}

// Generate harmonious colors based on color theory
const generateHarmoniousColors = (baseColor?: string) => {
  // If no base color is provided, generate a random one
  const base = baseColor || generateRandomColor()

  // Convert hex to HSL for easier manipulation
  const hexToHsl = (hex: string) => {
    // Convert hex to RGB
    const r = Number.parseInt(hex.slice(1, 3), 16) / 255
    const g = Number.parseInt(hex.slice(3, 5), 16) / 255
    const b = Number.parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }

      h /= 6
    }

    return [h * 360, s * 100, l * 100]
  }

  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  // Get base color in HSL
  const [h, s, l] = hexToHsl(base)

  // Generate complementary, analogous, and monochromatic colors
  return [
    base,
    hslToHex((h + 30) % 360, s, l), // Analogous
    hslToHex((h + 60) % 360, s, l), // Analogous
    hslToHex((h + 180) % 360, s, l), // Complementary
    hslToHex(h, s, Math.min(l + 20, 90)), // Lighter shade
  ]
}

// Convert hex to RGB
const hexToRgb = (hex: string) => {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

interface ColorPalette {
  id: string
  name: string
  colors: string[]
  tags: string[]
  favorite: boolean
  createdAt: number
}

export default function ColorPaletteGenerator() {
  const [colors, setColors] = useState<string[]>([])
  const [lockedColors, setLockedColors] = useState<boolean[]>([false, false, false, false, false])
  const [showRgb, setShowRgb] = useState<boolean>(false)
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [paletteName, setPaletteName] = useState<string>("")
  const [paletteTags, setPaletteTags] = useState<string>("")
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([])
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false)

  // Initialize colors and load saved palettes
  useEffect(() => {
    generateNewPalette()

    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }

    // Load saved palettes from localStorage
    const savedPalettesFromStorage = localStorage.getItem("savedPalettes")
    if (savedPalettesFromStorage) {
      setSavedPalettes(JSON.parse(savedPalettesFromStorage))
    }
  }, [])

  // Update document class when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Save palettes to localStorage when they change
  useEffect(() => {
    if (savedPalettes.length > 0) {
      localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes))
    }
  }, [savedPalettes])

  const generateNewPalette = () => {
    setColors((prev) => {
      const newColors = [...prev]

      // Generate new colors, keeping locked ones
      const baseColor = newColors.length > 0 && !lockedColors[0] ? undefined : newColors[0]
      const generatedColors = generateHarmoniousColors(baseColor)

      return generatedColors.map((color, index) => {
        return lockedColors[index] ? prev[index] || color : color
      })
    })
  }

  const replaceColor = (index: number) => {
    setColors((prev) => {
      const newColors = [...prev]
      newColors[index] = generateRandomColor()
      return newColors
    })
  }

  const toggleLock = (index: number) => {
    setLockedColors((prev) => {
      const newLocked = [...prev]
      newLocked[index] = !newLocked[index]
      return newLocked
    })
  }

  const copyColor = (color: string, format: "hex" | "rgb") => {
    const colorValue = format === "hex" ? color : hexToRgb(color)
    navigator.clipboard.writeText(colorValue)
    toast({
      title: "Color copied!",
      description: `${colorValue} has been copied to clipboard.`,
      duration: 2000,
    })
  }

  const savePalette = () => {
    if (!paletteName.trim()) {
      toast({
        title: "Name required",
        description: "Please give your palette a name before saving.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name: paletteName,
      colors: [...colors],
      tags: paletteTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      favorite: false,
      createdAt: Date.now(),
    }

    setSavedPalettes((prev) => [newPalette, ...prev])
    setPaletteName("")
    setPaletteTags("")

    toast({
      title: "Palette saved!",
      description: `"${paletteName}" has been added to your collection.`,
      duration: 3000,
    })
  }

  const toggleFavorite = (id: string) => {
    setSavedPalettes((prev) =>
      prev.map((palette) => (palette.id === id ? { ...palette, favorite: !palette.favorite } : palette)),
    )
  }

  const deletePalette = (id: string) => {
    setSavedPalettes((prev) => prev.filter((palette) => palette.id !== id))
  }

  const loadPalette = (palette: ColorPalette) => {
    setColors(palette.colors)
    setLockedColors([false, false, false, false, false])

    toast({
      title: "Palette loaded",
      description: `"${palette.name}" has been loaded.`,
      duration: 2000,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <MoroccanPattern className="fixed inset-0 opacity-5 pointer-events-none" />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-emerald-600 dark:from-amber-400 dark:to-emerald-400 text-transparent bg-clip-text">
          Color Palette Generator
        </h1>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch checked={darkMode} onCheckedChange={setDarkMode} id="dark-mode" />
            <Label htmlFor="dark-mode" className="cursor-pointer">
              {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch checked={showRgb} onCheckedChange={setShowRgb} id="color-format" />
            <Label htmlFor="color-format" className="cursor-pointer">
              {showRgb ? "RGB" : "HEX"}
            </Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {colors.map((color, index) => (
          <Card
            key={index}
            className="overflow-hidden backdrop-blur-sm bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/20 shadow-lg transition-all duration-300 hover:shadow-xl group"
          >
            <div
              className="h-40 cursor-pointer relative group"
              style={{ backgroundColor: color }}
              onClick={() => copyColor(color, showRgb ? "rgb" : "hex")}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                <Copy className="w-8 h-8 text-white drop-shadow-md" />
              </div>

              <button
                className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLock(index)
                }}
              >
                {lockedColors[index] ? (
                  <Lock className="w-4 h-4 text-white drop-shadow-md" />
                ) : (
                  <Unlock className="w-4 h-4 text-white drop-shadow-md" />
                )}
              </button>

              <button
                className="absolute bottom-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  replaceColor(index)
                }}
              >
                <RefreshCw className="w-4 h-4 text-white drop-shadow-md" />
              </button>
            </div>

            <CardContent className="p-4">
              <div className="text-center font-mono">
                <p className="font-bold select-all">{showRgb ? hexToRgb(color) : color.toUpperCase()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <Button
          onClick={generateNewPalette}
          className="bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-700 hover:to-emerald-700 text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Generate New Palette
        </Button>

        <Button variant="outline" onClick={() => setShowExportOptions(true)}>
          <Download className="mr-2 h-4 w-4" /> Export Options
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="backdrop-blur-sm bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/20">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Save This Palette</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="palette-name">Palette Name</Label>
                <Input
                  id="palette-name"
                  value={paletteName}
                  onChange={(e) => setPaletteName(e.target.value)}
                  placeholder="My Awesome Palette"
                  className="bg-white/50 dark:bg-slate-700/50"
                />
              </div>

              <div>
                <Label htmlFor="palette-tags">Tags (comma separated)</Label>
                <Input
                  id="palette-tags"
                  value={paletteTags}
                  onChange={(e) => setPaletteTags(e.target.value)}
                  placeholder="moroccan, warm, natural"
                  className="bg-white/50 dark:bg-slate-700/50"
                />
              </div>

              <Button onClick={savePalette} className="w-full">
                <Save className="mr-2 h-4 w-4" /> Save Palette
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/20">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Contrast Checker</h2>
            <ContrastChecker colors={colors} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-12">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Palettes</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <SavedPalettes
            palettes={savedPalettes}
            onLoad={loadPalette}
            onDelete={deletePalette}
            onToggleFavorite={toggleFavorite}
          />
        </TabsContent>

        <TabsContent value="favorites">
          <SavedPalettes
            palettes={savedPalettes.filter((p) => p.favorite)}
            onLoad={loadPalette}
            onDelete={deletePalette}
            onToggleFavorite={toggleFavorite}
          />
        </TabsContent>
      </Tabs>

      <AuthorFooter />

      {showExportOptions && <ExportOptions colors={colors} onClose={() => setShowExportOptions(false)} />}

      <Toaster />
    </div>
  )
}
