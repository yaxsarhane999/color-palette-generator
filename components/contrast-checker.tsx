"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface ContrastCheckerProps {
  colors: string[]
}

export default function ContrastChecker({ colors }: ContrastCheckerProps) {
  const [backgroundColor, setBackgroundColor] = useState(colors[0] || "#ffffff")
  const [textColor, setTextColor] = useState(colors[1] || "#000000")

  // Calculate contrast ratio
  const calculateContrastRatio = (color1: string, color2: string) => {
    // Convert hex to RGB
    const getRGB = (hex: string) => {
      const r = Number.parseInt(hex.slice(1, 3), 16) / 255
      const g = Number.parseInt(hex.slice(3, 5), 16) / 255
      const b = Number.parseInt(hex.slice(5, 7), 16) / 255
      return [r, g, b]
    }

    // Calculate luminance
    const getLuminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map((val) => {
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
      })

      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const rgb1 = getRGB(color1)
    const rgb2 = getRGB(color2)

    const l1 = getLuminance(rgb1)
    const l2 = getLuminance(rgb2)

    // Calculate contrast ratio
    const ratio = l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05)

    return ratio.toFixed(2)
  }

  const contrastRatio = calculateContrastRatio(backgroundColor, textColor)
  const isAALarge = Number.parseFloat(contrastRatio) >= 3
  const isAA = Number.parseFloat(contrastRatio) >= 4.5
  const isAAA = Number.parseFloat(contrastRatio) >= 7

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="background-color">Background Color</Label>
          <Select value={backgroundColor} onValueChange={setBackgroundColor}>
            <SelectTrigger id="background-color" className="w-full">
              <SelectValue placeholder="Select background color" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color, index) => (
                <SelectItem key={index} value={color}>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 mr-2 rounded-full border border-slate-300 dark:border-slate-600"
                      style={{ backgroundColor: color }}
                    />
                    {color}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="text-color">Text Color</Label>
          <Select value={textColor} onValueChange={setTextColor}>
            <SelectTrigger id="text-color" className="w-full">
              <SelectValue placeholder="Select text color" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color, index) => (
                <SelectItem key={index} value={color}>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 mr-2 rounded-full border border-slate-300 dark:border-slate-600"
                      style={{ backgroundColor: color }}
                    />
                    {color}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-6 rounded-lg mb-4 text-center" style={{ backgroundColor, color: textColor }}>
        <p className="text-lg font-bold mb-2">Sample Text</p>
        <p>This is how your text will look on this background.</p>
      </div>

      <div className="space-y-2">
        <p className="font-bold">Contrast Ratio: {contrastRatio}:1</p>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${isAALarge ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"}`}
            >
              {isAALarge ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </div>
            <span>AA Large Text</span>
          </div>

          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${isAA ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"}`}
            >
              {isAA ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </div>
            <span>AA Normal Text</span>
          </div>

          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${isAAA ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"}`}
            >
              {isAAA ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </div>
            <span>AAA Normal Text</span>
          </div>
        </div>
      </div>
    </div>
  )
}
