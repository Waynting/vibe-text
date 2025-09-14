'use client'

import { DocMeta, ViewSettings, ScreenshotSettings } from '@/types'
import { captureScreenshot } from '@/utils/screenshot'

interface ToolbarProps {
  meta: DocMeta
  setMeta: (meta: Partial<DocMeta>) => void
  wordCount: number
  filePath?: string
  fileName?: string
  setFileName: (fileName: string) => void
  onNew: () => void
  onOpen: () => void
  onSave: () => void
  onSaveAs: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  viewSettings: ViewSettings
  onViewSettingsChange: (settings: ViewSettings) => void
  isMobileMenuOpen?: boolean
  onCloseMobileMenu?: () => void
}

export function Sidebar({ 
  meta, 
  setMeta, 
  wordCount, 
  filePath, 
  fileName, 
  setFileName, 
  onNew, 
  onOpen, 
  onSave, 
  onSaveAs, 
  theme, 
  onToggleTheme, 
  viewSettings, 
  onViewSettingsChange,
  isMobileMenuOpen,
  onCloseMobileMenu
}: ToolbarProps) {

  const handleDirectionToggle = () => {
    const newDirection = viewSettings.direction === 'rtl' ? 'ltr' : 'rtl'
    onViewSettingsChange({
      ...viewSettings,
      direction: newDirection
    })
  }

  const handleMobileAction = (action: () => void) => {
    action()
    if (onCloseMobileMenu) {
      onCloseMobileMenu()
    }
  }

  const getToolbarClasses = () => {
    let classes = 'toolbar'
    
    // Mobile states
    if (isMobileMenuOpen) {
      classes += ' open'
    }
    
    return classes
  }

  return (
    <div className={getToolbarClasses()}>
      {/* Mobile close button - at top on mobile */}
      <button
        className="mobile-close-button md:hidden"
        onClick={() => onCloseMobileMenu && onCloseMobileMenu()}
        aria-label="收合選單"
      >
        收起選單
      </button>
      
      {/* File operations */}
      <div className="section">
        <div className="btn-group-row">
          <button onClick={() => handleMobileAction(onNew)} className="btn">新建</button>
          <button onClick={() => handleMobileAction(onOpen)} className="btn">開啟</button>
        </div>
        <div className="btn-group-row" style={{marginTop: '4px'}}>
          <button onClick={() => handleMobileAction(onSave)} className="btn">儲存</button>
          <button onClick={() => handleMobileAction(onSaveAs)} className="btn">另存</button>
        </div>
      </div>

      {/* File information */}
      <div className="section">
        <div>
          <div className="label">檔名</div>
          <input
            type="text"
            value={fileName || ''}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="輸入檔名"
            className="input-field"
          />
        </div>
        
        {filePath && (
          <div>
            <div className="label">路徑</div>
            <div className="file-path" title={filePath}>
              {filePath.length > 30 ? '...' + filePath.slice(-27) : filePath}
            </div>
          </div>
        )}
      </div>

      {/* Document metadata */}
      <div className="section">
        <div>
          <div className="label">標題</div>
          <input
            type="text"
            value={meta.title}
            onChange={(e) => setMeta({ title: e.target.value })}
            placeholder="文件標題"
            className="input-field"
          />
        </div>
        
        <div>
          <div className="label">編號</div>
          <input
            type="text"
            value={meta.id}
            onChange={(e) => setMeta({ id: e.target.value })}
            placeholder="文件編號"
            className="input-field"
          />
        </div>
      </div>

      {/* Document description */}
      <div className="section">
        <div className="section-title">文件說明</div>
        <textarea
          value={meta.description || ''}
          onChange={(e) => setMeta({ description: e.target.value })}
          placeholder="輸入文件說明..."
          className="input-field description-field"
          rows={3}
        />
      </div>

      {/* Text Direction Toggle */}
      <div className="section">
        <div className="section-title">文字方向</div>
        <button onClick={() => handleMobileAction(handleDirectionToggle)} className="btn theme-toggle">
          {viewSettings.direction === 'rtl' ? '右起' : '左起'}
        </button>
      </div>


      {/* Screenshot */}
      <div className="section">
        <div className="section-title">輸出圖片</div>
        <button 
          onClick={async () => {
            const screenshotContainer = document.querySelector('#screenshot-container')
            if (screenshotContainer) {
              try {
                await captureScreenshot({
                  element: screenshotContainer as HTMLElement,
                  format: 'jpeg',
                  quality: 95,
                  includeTitle: true,
                  currentPageOnly: true,
                  fileName: `${fileName || meta.title || '未命名'}`
                })
              } catch (error) {
                alert('截圖失敗，請稍後再試')
              }
            }
          }} 
          className="btn"
        >
          截圖
        </button>
      </div>

      {/* Theme toggle */}
      <div className="section">
        <div className="section-title">主題</div>
        <button onClick={() => handleMobileAction(onToggleTheme)} className="btn theme-toggle">
          {theme === 'light' ? '深色' : '淺色'}
        </button>
      </div>

      {/* Word count - at bottom */}
      <div className="word-count">
        {wordCount} 字
      </div>
    </div>
  )
}