document.addEventListener("DOMContentLoaded", () => {
  // State
  let colors = []
  let lockedColors = [false, false, false, false, false]
  let showRgb = false
  let darkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  let savedPalettes = JSON.parse(localStorage.getItem("savedPalettes")) || []
  let activeTab = "all"
  let activeExportTab = "css"

  // DOM Elements
  const colorPalette = document.getElementById("colorPalette")
  const generateBtn = document.getElementById("generateBtn")
  const exportBtn = document.getElementById("exportBtn")
  const savePaletteBtn = document.getElementById("savePaletteBtn")
  const paletteNameInput = document.getElementById("paletteName")
  const paletteTagsInput = document.getElementById("paletteTags")
  const savedPalettesContainer = document.getElementById("savedPalettes")
  const tabBtns = document.querySelectorAll(".tab-btn")
  const darkModeToggle = document.getElementById("darkModeToggle")
  const colorFormatToggle = document.getElementById("colorFormatToggle")
  const exportModal = document.getElementById("exportModal")
  const closeExportModal = document.getElementById("closeExportModal")
  const exportCanvas = document.getElementById("exportCanvas")
  const downloadPngBtn = document.getElementById("downloadPngBtn")
  const exportTabBtns = document.querySelectorAll("[data-export-tab]")
  const copyBtns = document.querySelectorAll(".copy-btn")
  const bgColorSelect = document.getElementById("bgColorSelect")
  const textColorSelect = document.getElementById("textColorSelect")
  const previewText = document.getElementById("previewText")
  const contrastRatio = document.getElementById("contrastRatio")
  const checkAALarge = document.getElementById("checkAALarge")
  const checkAA = document.getElementById("checkAA")
  const checkAAA = document.getElementById("checkAAA")
  const currentYearSpan = document.getElementById("currentYear")
  const moroccanPattern = document.getElementById("moroccanPattern")

  // Helper functions (These should ideally be in a separate utility file)
  function generateHarmoniousColors(baseColor) {
    // Placeholder implementation - replace with your actual logic
    const numColors = 5
    const generatedColors = []
    for (let i = 0; i < numColors; i++) {
      generatedColors.push(generateRandomColor()) // Use generateRandomColor here
    }
    return generatedColors
  }

  function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b
    })

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `rgb(${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)})`
      : null
  }

  function generateRandomColor() {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    )
  }

  function showToast(title, message, duration = 2000) {
    // Placeholder implementation - replace with your actual logic
    alert(`${title}: ${message}`) // Using alert as a simple toast alternative
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp)
    const options = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString(undefined, options)
  }

  function calculateContrastRatio(color1, color2) {
    const luminance1 = getLuminance(color1)
    const luminance2 = getLuminance(color2)

    const brighter = Math.max(luminance1, luminance2)
    const darker = Math.min(luminance1, luminance2)

    return ((brighter + 0.05) / (darker + 0.05)).toFixed(2)
  }

  function getLuminance(color) {
    const rgb = hexToRgb(color)
      .substring(4, hexToRgb(color).length - 1)
      .replace(/ /g, "")
      .split(",")
      .map((c) => {
        const component = Number.parseInt(c) / 255

        if (component <= 0.03928) {
          return component / 12.92
        } else {
          return Math.pow((component + 0.055) / 1.055, 2.4)
        }
      })

    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  }

  function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16)
    const g = Number.parseInt(hexColor.slice(3, 5), 16)
    const b = Number.parseInt(hexColor.slice(5, 7), 16)

    // Calculate relative luminance
    const a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Return black or white based on luminance
    return a < 0.5 ? "black" : "white"
  }

  // Initialize
  init()

  // Functions
  function init() {
    // Set current year in footer
    currentYearSpan.textContent = new Date().getFullYear()

    // Apply dark mode if needed
    if (darkMode) {
      document.body.classList.add("dark-mode")
      darkModeToggle.checked = true
    }

    // Generate initial colors
    generateNewPalette()

    // Draw Moroccan pattern
    drawMoroccanPattern()

    // Render saved palettes
    renderSavedPalettes()

    // Set up event listeners
    setupEventListeners()
  }

  function setupEventListeners() {
    // Generate new palette
    generateBtn.addEventListener("click", generateNewPalette)

    // Export options
    exportBtn.addEventListener("click", openExportModal)
    closeExportModal.addEventListener("click", closeExportModalHandler)
    downloadPngBtn.addEventListener("click", downloadPng)

    // Save palette
    savePaletteBtn.addEventListener("click", savePalette)

    // Tab switching
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTab = btn.dataset.tab
        updateActiveTabs()
        renderSavedPalettes()
      })
    })

    // Export tab switching
    exportTabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        activeExportTab = btn.dataset.exportTab
        updateActiveExportTabs()
      })
    })

    // Copy buttons
    copyBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.copy
        copyToClipboard(type)
      })
    })

    // Dark mode toggle
    darkModeToggle.addEventListener("change", toggleDarkMode)

    // Color format toggle
    colorFormatToggle.addEventListener("change", toggleColorFormat)

    // Contrast checker
    bgColorSelect.addEventListener("change", updateContrastChecker)
    textColorSelect.addEventListener("change", updateContrastChecker)

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === exportModal) {
        closeExportModalHandler()
      }
    })

    // Resize event for pattern
    window.addEventListener("resize", drawMoroccanPattern)
  }

  function generateNewPalette() {
    const newColors = [...colors]
    const baseColor = newColors.length > 0 && !lockedColors[0] ? undefined : newColors[0]
    const generatedColors = generateHarmoniousColors(baseColor)

    colors = generatedColors.map((color, index) => {
      return lockedColors[index] ? colors[index] || color : color
    })

    renderColorPalette()
    updateContrastSelects()
    updateContrastChecker()
    updateExportOutputs()
  }

  function renderColorPalette() {
    colorPalette.innerHTML = ""

    colors.forEach((color, index) => {
      const colorCard = document.createElement("div")
      colorCard.className = "color-card"

      const colorPreview = document.createElement("div")
      colorPreview.className = "color-preview"
      colorPreview.style.backgroundColor = color
      colorPreview.addEventListener("click", () => copyColor(color))

      const colorOverlay = document.createElement("div")
      colorOverlay.className = "color-overlay"
      colorOverlay.innerHTML = '<i class="fas fa-copy"></i>'

      const colorActions = document.createElement("div")
      colorActions.className = "color-actions"

      const lockBtn = document.createElement("button")
      lockBtn.className = "color-action-btn"
      lockBtn.innerHTML = lockedColors[index] ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-lock-open"></i>'
      lockBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        toggleLock(index)
      })

      const replaceBtn = document.createElement("button")
      replaceBtn.className = "color-action-btn"
      replaceBtn.innerHTML = '<i class="fas fa-sync-alt"></i>'
      replaceBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        replaceColor(index)
      })

      colorActions.appendChild(lockBtn)
      colorActions.appendChild(replaceBtn)

      colorPreview.appendChild(colorOverlay)
      colorPreview.appendChild(colorActions)

      const colorInfo = document.createElement("div")
      colorInfo.className = "color-info"

      const colorValue = document.createElement("div")
      colorValue.className = "color-value"
      colorValue.textContent = showRgb ? hexToRgb(color) : color.toUpperCase()

      colorInfo.appendChild(colorValue)
      colorCard.appendChild(colorPreview)
      colorCard.appendChild(colorInfo)
      colorPalette.appendChild(colorCard)
    })
  }

  function toggleLock(index) {
    lockedColors[index] = !lockedColors[index]
    renderColorPalette()
  }

  function replaceColor(index) {
    colors[index] = generateRandomColor()
    renderColorPalette()
    updateContrastSelects()
    updateContrastChecker()
    updateExportOutputs()
  }

  function copyColor(color) {
    const colorValue = showRgb ? hexToRgb(color) : color
    navigator.clipboard.writeText(colorValue)
    showToast("Color copied!", `${colorValue} has been copied to clipboard.`)
  }

  function savePalette() {
    const name = paletteNameInput.value.trim()
    if (!name) {
      showToast("Name required", "Please give your palette a name before saving.", 3000)
      return
    }

    const tags = paletteTagsInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag)

    const newPalette = {
      id: Date.now().toString(),
      name,
      colors: [...colors],
      tags,
      favorite: false,
      createdAt: Date.now(),
    }

    savedPalettes = [newPalette, ...savedPalettes]
    localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes))

    paletteNameInput.value = ""
    paletteTagsInput.value = ""

    renderSavedPalettes()
    showToast("Palette saved!", `"${name}" has been added to your collection.`)
  }

  function renderSavedPalettes() {
    const filteredPalettes = activeTab === "favorites" ? savedPalettes.filter((p) => p.favorite) : savedPalettes

    if (filteredPalettes.length === 0) {
      savedPalettesContainer.innerHTML = `
        <div class="empty-state">
          <p>No saved palettes yet.</p>
        </div>
      `
      return
    }

    savedPalettesContainer.innerHTML = ""

    filteredPalettes.forEach((palette) => {
      const paletteCard = document.createElement("div")
      paletteCard.className = "saved-palette-card"

      const paletteColors = document.createElement("div")
      paletteColors.className = "palette-colors"

      palette.colors.forEach((color) => {
        const colorDiv = document.createElement("div")
        colorDiv.className = "palette-color"
        colorDiv.style.backgroundColor = color
        paletteColors.appendChild(colorDiv)
      })

      const paletteInfo = document.createElement("div")
      paletteInfo.className = "palette-info"

      const paletteHeader = document.createElement("div")
      paletteHeader.className = "palette-header"

      const paletteName = document.createElement("div")
      paletteName.className = "palette-name"
      paletteName.textContent = palette.name

      const favoriteBtn = document.createElement("button")
      favoriteBtn.className = `favorite-btn ${palette.favorite ? "active" : ""}`
      favoriteBtn.innerHTML = `<i class="fas fa-star"></i>`
      favoriteBtn.addEventListener("click", () => toggleFavorite(palette.id))

      paletteHeader.appendChild(paletteName)
      paletteHeader.appendChild(favoriteBtn)

      const paletteTags = document.createElement("div")
      paletteTags.className = "palette-tags"

      palette.tags.forEach((tag) => {
        const tagSpan = document.createElement("span")
        tagSpan.className = "tag"
        tagSpan.textContent = tag
        paletteTags.appendChild(tagSpan)
      })

      const paletteActions = document.createElement("div")
      paletteActions.className = "palette-actions"

      const deleteBtn = document.createElement("button")
      deleteBtn.className = "btn destructive"
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Delete'
      deleteBtn.addEventListener("click", () => deletePalette(palette.id))

      const loadBtn = document.createElement("button")
      loadBtn.className = "btn outline"
      loadBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Load'
      loadBtn.addEventListener("click", () => loadPalette(palette))

      paletteActions.appendChild(deleteBtn)
      paletteActions.appendChild(loadBtn)

      const paletteDate = document.createElement("div")
      paletteDate.className = "palette-date"
      paletteDate.textContent = `Created ${formatDate(palette.createdAt)}`

      paletteInfo.appendChild(paletteHeader)
      paletteInfo.appendChild(paletteTags)
      paletteInfo.appendChild(paletteActions)
      paletteInfo.appendChild(paletteDate)

      paletteCard.appendChild(paletteColors)
      paletteCard.appendChild(paletteInfo)

      savedPalettesContainer.appendChild(paletteCard)
    })
  }

  function toggleFavorite(id) {
    savedPalettes = savedPalettes.map((palette) =>
      palette.id === id ? { ...palette, favorite: !palette.favorite } : palette,
    )
    localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes))
    renderSavedPalettes()
  }

  function deletePalette(id) {
    savedPalettes = savedPalettes.filter((palette) => palette.id !== id)
    localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes))
    renderSavedPalettes()
  }

  function loadPalette(palette) {
    colors = [...palette.colors]
    lockedColors = [false, false, false, false, false]
    renderColorPalette()
    updateContrastSelects()
    updateContrastChecker()
    updateExportOutputs()
    showToast("Palette loaded", `"${palette.name}" has been loaded.`)
  }

  function updateActiveTabs() {
    tabBtns.forEach((btn) => {
      if (btn.dataset.tab === activeTab) {
        btn.classList.add("active")
      } else {
        btn.classList.remove("active")
      }
    })
  }

  function updateActiveExportTabs() {
    exportTabBtns.forEach((btn) => {
      if (btn.dataset.exportTab === activeExportTab) {
        btn.classList.add("active")
      } else {
        btn.classList.remove("active")
      }
    })

    document.querySelectorAll("[data-export-content]").forEach((content) => {
      if (content.dataset.exportContent === activeExportTab) {
        content.classList.add("active")
      } else {
        content.classList.remove("active")
      }
    })
  }

  function toggleDarkMode() {
    darkMode = darkModeToggle.checked
    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
    drawMoroccanPattern()
  }

  function toggleColorFormat() {
    showRgb = colorFormatToggle.checked
    renderColorPalette()
  }

  function updateContrastSelects() {
    bgColorSelect.innerHTML = ""
    textColorSelect.innerHTML = ""

    colors.forEach((color, index) => {
      const bgOption = document.createElement("option")
      bgOption.value = color
      bgOption.textContent = `Color ${index + 1}: ${color}`
      bgColorSelect.appendChild(bgOption)

      const textOption = document.createElement("option")
      textOption.value = color
      textOption.textContent = `Color ${index + 1}: ${color}`
      textColorSelect.appendChild(textOption)
    })

    // Set default values
    bgColorSelect.value = colors[0] || "#ffffff"
    textColorSelect.value = colors[1] || "#000000"
  }

  function updateContrastChecker() {
    const bgColor = bgColorSelect.value
    const textColor = textColorSelect.value

    previewText.style.backgroundColor = bgColor
    previewText.style.color = textColor

    const ratio = calculateContrastRatio(bgColor, textColor)
    contrastRatio.textContent = ratio

    const isAALarge = Number.parseFloat(ratio) >= 3
    const isAA = Number.parseFloat(ratio) >= 4.5
    const isAAA = Number.parseFloat(ratio) >= 7

    checkAALarge.className = `check-icon ${isAALarge ? "success" : "error"}`
    checkAALarge.innerHTML = isAALarge ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>'

    checkAA.className = `check-icon ${isAA ? "success" : "error"}`
    checkAA.innerHTML = isAA ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>'

    checkAAA.className = `check-icon ${isAAA ? "success" : "error"}`
    checkAAA.innerHTML = isAAA ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>'
  }

  function openExportModal() {
    updateExportOutputs()
    renderExportPreview()
    exportModal.classList.add("active")
  }

  function closeExportModalHandler() {
    exportModal.classList.remove("active")
  }

  function updateExportOutputs() {
    // CSS Variables
    const cssVariables = colors.map((color, index) => `  --color-${index + 1}: ${color};`).join("\n")
    const cssOutput = `:root {\n${cssVariables}\n}`
    document.getElementById("cssOutput").textContent = cssOutput

    // Tailwind Config
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
    document.getElementById("tailwindOutput").textContent = tailwindOutput

    // SCSS Variables
    const scssOutput = colors.map((color, index) => `$color-${index + 1}: ${color};`).join("\n")
    document.getElementById("scssOutput").textContent = scssOutput

    // JSON
    const jsonOutput = JSON.stringify({ colors }, null, 2)
    document.getElementById("jsonOutput").textContent = jsonOutput
  }

  function renderExportPreview() {
    const canvas = exportCanvas
    const ctx = canvas.getContext("2d")

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
  }

  function downloadPng() {
    const canvas = exportCanvas
    const link = document.createElement("a")
    link.download = "color-palette.png"
    link.href = canvas.toDataURL("image/png")
    link.click()

    showToast("Downloaded!", "PNG image has been downloaded.")
  }

  function copyToClipboard(type) {
    let text = ""
    switch (type) {
      case "css":
        text = document.getElementById("cssOutput").textContent
        break
      case "tailwind":
        text = document.getElementById("tailwindOutput").textContent
        break
      case "scss":
        text = document.getElementById("scssOutput").textContent
        break
      case "json":
        text = document.getElementById("jsonOutput").textContent
        break
    }

    navigator.clipboard.writeText(text)
    showToast("Copied!", `${type.toUpperCase()} has been copied to clipboard.`)

    // Update button text temporarily
    const btn = document.querySelector(`[data-copy="${type}"]`)
    const originalHTML = btn.innerHTML
    btn.innerHTML = '<i class="fas fa-check"></i> Copied!'
    setTimeout(() => {
      btn.innerHTML = originalHTML
    }, 2000)
  }

  function drawMoroccanPattern() {
    const canvas = moroccanPattern
    const ctx = canvas.getContext("2d")

    // Set canvas dimensions to match window
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Define pattern size
    const tileSize = 80
    const rows = Math.ceil(canvas.height / tileSize)
    const cols = Math.ceil(canvas.width / tileSize)

    // Define colors
    const strokeColor = darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"

    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 1

    // Draw Moroccan star pattern
    for (let row = -1; row <= rows; row++) {
      for (let col = -1; col <= cols; col++) {
        const x = col * tileSize
        const y = row * tileSize

        // Draw octagon
        ctx.beginPath()
        const offset = tileSize / 4

        ctx.moveTo(x + offset, y)
        ctx.lineTo(x + tileSize - offset, y)
        ctx.lineTo(x + tileSize, y + offset)
        ctx.lineTo(x + tileSize, y + tileSize - offset)
        ctx.lineTo(x + tileSize - offset, y + tileSize)
        ctx.lineTo(x + offset, y + tileSize)
        ctx.lineTo(x, y + tileSize - offset)
        ctx.lineTo(x, y + offset)
        ctx.closePath()
        ctx.stroke()

        // Draw inner star
        ctx.beginPath()
        const center = tileSize / 2
        const innerOffset = tileSize / 8

        ctx.moveTo(x + center, y + innerOffset)
        ctx.lineTo(x + center + innerOffset, y + center - innerOffset)
        ctx.lineTo(x + tileSize - innerOffset, y + center)
        ctx.lineTo(x + center + innerOffset, y + center + innerOffset)
        ctx.lineTo(x + center, y + tileSize - innerOffset)
        ctx.lineTo(x + center - innerOffset, y + center + innerOffset)
        ctx.lineTo(x + innerOffset, y + center)
        ctx.lineTo(x + center - innerOffset, y + center - innerOffset)
        ctx.closePath()
        ctx.stroke()
      }
    }
  }
})
