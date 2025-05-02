/**
 * Color Utility Functions
 */

// Generate a random color in hex format
function generateRandomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  )
}

// Convert hex to RGB
function hexToRgb(hex) {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

// Convert hex to HSL
function hexToHsl(hex) {
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
function hslToHex(h, s, l) {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
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

  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// Generate harmonious colors based on color theory
function generateHarmoniousColors(baseColor) {
  // If no base color is provided, generate a random one
  const base = baseColor || generateRandomColor()

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

// Calculate contrast ratio between two colors
function calculateContrastRatio(color1, color2) {
  // Convert hex to RGB
  const getRGB = (hex) => {
    const r = Number.parseInt(hex.slice(1, 3), 16) / 255
    const g = Number.parseInt(hex.slice(3, 5), 16) / 255
    const b = Number.parseInt(hex.slice(5, 7), 16) / 255
    return [r, g, b]
  }

  // Calculate luminance
  const getLuminance = (rgb) => {
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

// Get contrast color (black or white) based on background
function getContrastColor(hexColor) {
  // Convert hex to RGB
  const r = Number.parseInt(hexColor.slice(1, 3), 16)
  const g = Number.parseInt(hexColor.slice(3, 5), 16)
  const b = Number.parseInt(hexColor.slice(5, 7), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return black or white based on luminance
  return luminance > 0.5 ? "#000000" : "#ffffff"
}

// Show toast notification
function showToast(title, message, duration = 3000) {
  const toast = document.getElementById("toast")
  const toastTitle = toast.querySelector(".toast-title")
  const toastMessage = toast.querySelector(".toast-message")

  toastTitle.textContent = title
  toastMessage.textContent = message

  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, duration)
}

// Format date
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString()
}
