import { ScreenshotSettings } from '@/types'

export interface ScreenshotOptions extends ScreenshotSettings {
  element: HTMLElement
  fileName?: string
}

export async function captureScreenshot(options: ScreenshotOptions): Promise<void> {
  const {
    element,
    format,
    quality = 95,
    fileName = `vibe-text-${new Date().toISOString().slice(0, 10)}`
  } = options

  try {
    // 動態導入 html2canvas，確保只在客戶端載入
    const html2canvas = (await import('html2canvas')).default
    
    // 判斷當前主題
    const rootElement = document.documentElement
    const currentTheme = rootElement.getAttribute('data-theme')
    const bgColor = currentTheme === 'dark' ? '#000000' : '#ffffff'
    
    // 使用 html2canvas 擷取元素
    const canvas = await html2canvas(element, {
      backgroundColor: bgColor, // 根據主題設定背景色
      scale: 2, // 高解析度
      logging: false,
      useCORS: true,
      allowTaint: true
    })

    // 如果是 JPEG，需要先填充背景（因為 JPEG 不支援透明度）
    if (format === 'jpeg') {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // 創建新的 canvas 並填充白色背景
        const newCanvas = document.createElement('canvas')
        newCanvas.width = canvas.width
        newCanvas.height = canvas.height
        const newCtx = newCanvas.getContext('2d')
        
        if (newCtx) {
          // 填充背景色
          newCtx.fillStyle = bgColor
          newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height)
          // 繪製原圖
          newCtx.drawImage(canvas, 0, 0)
          
          // 使用新的 canvas 進行下載
          newCanvas.toBlob((blob) => {
            if (!blob) {
              throw new Error('無法生成圖片')
            }

            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${fileName}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }, 'image/jpeg', quality / 100)
          
          return
        }
      }
    }
    
    // PNG 格式直接下載
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('無法生成圖片')
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${fileName}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, `image/${format}`, quality / 100)

  } catch (error) {
    console.error('截圖失敗：', error)
    throw new Error('截圖失敗，請稍後再試')
  }
}

export async function captureMultiplePages(
  pages: HTMLElement[],
  settings: ScreenshotSettings,
  fileName?: string
): Promise<void> {
  const baseFileName = fileName || `vibe-text-${new Date().toISOString().slice(0, 10)}`

  for (let i = 0; i < pages.length; i++) {
    await captureScreenshot({
      element: pages[i],
      format: settings.format,
      quality: settings.quality,
      includeTitle: settings.includeTitle,
      currentPageOnly: false,
      fileName: `${baseFileName}-page-${i + 1}`
    })
    
    // 延遲一下避免過快
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}