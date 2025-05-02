"use client"

import { useState, useRef, useEffect } from "react"
import { X, Download, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

interface ExportOptionsProps {
  colors: string[]
  onClose: () => void
}

export default function ExportOptions({ colors, onClose }: ExportOptionsProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate CSS variables
  const cssVariables = colors.map((color, index) => `  --color-${index + 1}: ${color};`).join("\n")
  const cssOutput = `:root {\n${cssVariables}\n}`

  // Generate Tailwind config
  const tailwindOutput = `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        palette: {
${colors.map((color, index) => `          '${index + 1}': '${color}',`).join("\n")}
        }
      }
    }
  }
}`

  // Generate SCSS variables
  const scssOutput = colors.map((color, index) => `$color-${index + 1}: ${color};`).join("\n")

  // Generate JSON
  const jsonOutput = JSON.stringify({ colors }, null, 2)

  // Create PNG preview
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 200

    // Draw colors
    const colorWidth = canvas.width / colors.length
    colors.forEach((color, index) => {
      ctx.fillStyle = color
      ctx.fillRect(index * colorWidth, 0, colorWidth, canvas.height)

      // Add color code
      ctx.fillStyle = getContrastColor(color)
      ctx.font = "16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(color, index * colorWidth + colorWidth / 2, canvas.height / 2)
    })
  }, [colors])

  // Helper to determine text color based on background
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16)
    const g = Number.parseInt(hexColor.slice(3, 5), 16)
    const b = Number.parseInt(hexColor.slice(5, 7), 16)

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Return black or white based on luminance
    return luminance > 0.5 ? "#000000" : "#ffffff"
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)

    setTimeout(() => {
      setCopied(null)
    }, 2000)

    toast({
      title: "Copied!",
      description: `${type} has been copied to clipboard.`,
      duration: 2000,
    })
  }

  const downloadPNG = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "color-palette.png"
    link.href = canvas.toDataURL("image/png")
    link.click()

    toast({
      title: "Downloaded!",
      description: "PNG image has been downloaded.",
      duration: 2000,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
          <h2 className="text-2xl font-bold">Export Options</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Preview</h3>
            <div className="border dark:border-slate-700 rounded-lg overflow-hidden">
              <canvas ref={canvasRef} className="w-full h-auto" />
            </div>
            <Button variant="outline" className="mt-3" onClick={downloadPNG}>
              <Download className="mr-2 h-4 w-4" /> Download PNG
            </Button>
          </div>

          <Tabs defaultValue="css">
            <TabsList className="mb-4">
              <TabsTrigger value="css">CSS Variables</TabsTrigger>
              <TabsTrigger value="tailwind">Tailwind Config</TabsTrigger>
              <TabsTrigger value="scss">SCSS Variables</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="css">
              <div className="relative">
                <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-auto max-h-60 text-sm">
                  <code>{cssOutput}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(cssOutput, "CSS")}
                >
                  {copied === "CSS" ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied === "CSS" ? "Copied!" : "Copy"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="tailwind">
              <div className="relative">
                <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-auto max-h-60 text-sm">
                  <code>{tailwindOutput}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(tailwindOutput, "Tailwind")}
                >
                  {copied === "Tailwind" ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied === "Tailwind" ? "Copied!" : "Copy"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="scss">
              <div className="relative">
                <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-auto max-h-60 text-sm">
                  <code>{scssOutput}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(scssOutput, "SCSS")}
                >
                  {copied === "SCSS" ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied === "SCSS" ? "Copied!" : "Copy"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="json">
              <div className="relative">
                <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-auto max-h-60 text-sm">
                  <code>{jsonOutput}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(jsonOutput, "JSON")}
                >
                  {copied === "JSON" ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied === "JSON" ? "Copied!" : "Copy"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
