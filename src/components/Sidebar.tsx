'use client'

import { useState } from 'react'
import { DocMeta, ViewSettings } from '@/types'

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
  theme: 'light' | 'dark' | 'paper'
  onToggleLightDark: () => void
  onSetPaperTheme: () => void
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
  onToggleLightDark,
  onSetPaperTheme,
  viewSettings, 
  onViewSettingsChange,
  isMobileMenuOpen,
  onCloseMobileMenu
}: ToolbarProps) {
  const [isMetadataExpanded, setIsMetadataExpanded] = useState(false)

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
        <div className="btn-group-row" style={{marginTop: '2px'}}>
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

      {/* Metadata Section - Collapsible */}
      <div className="section">
        <button 
          className="section-title metadata-toggle"
          onClick={() => setIsMetadataExpanded(!isMetadataExpanded)}
          style={{ 
            width: '100%', 
            textAlign: 'left', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            padding: '0',
            color: 'inherit'
          }}
        >
          <span>進階資訊</span>
          <span style={{ fontSize: '0.8em' }}>{isMetadataExpanded ? '▼' : '▶'}</span>
        </button>
        
        {isMetadataExpanded && (
          <div style={{ 
            marginTop: '6px',
            animation: 'fadeIn 0.2s ease-in-out'
          }}>
            {/* Document description */}
            <div style={{ marginBottom: '6px' }}>
              <div className="label">文件說明</div>
              <textarea
                value={meta.description || ''}
                onChange={(e) => setMeta({ description: e.target.value })}
                placeholder="輸入文件說明..."
                className="input-field description-field"
                rows={2}
              />
            </div>

            {/* Document summary */}
            <div style={{ marginBottom: '6px' }}>
              <div className="label">摘要</div>
              <textarea
                value={meta.summary || ''}
                onChange={(e) => setMeta({ summary: e.target.value })}
                placeholder="文章摘要..."
                className="input-field"
                rows={1}
              />
            </div>

            {/* Categories */}
            <div style={{ marginBottom: '6px' }}>
              <div className="label">分類</div>
              <input
                type="text"
                value={meta.categories?.join(', ') || ''}
                onChange={(e) => setMeta({ 
                  categories: e.target.value
                    .split(',')
                    .map(cat => cat.trim())
                    .filter(cat => cat.length > 0)
                })}
                placeholder="分類 (逗號分隔)"
                className="input-field"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="label">網址代稱</div>
              <input
                type="text"
                value={meta.slug || ''}
                onChange={(e) => setMeta({ slug: e.target.value })}
                placeholder="url-slug"
                className="input-field"
              />
            </div>
          </div>
        )}
      </div>

      {/* Text Direction Toggle */}
      <div className="section">
        <div className="section-title">文字方向</div>
        <button onClick={() => handleMobileAction(handleDirectionToggle)} className="btn theme-toggle">
          {viewSettings.direction === 'rtl' ? '右起' : '左起'}
        </button>
      </div>



      {/* Theme toggle */}
      <div className="section">
        <div className="section-title">主題</div>
        <div className="btn-group-row">
          <button onClick={() => handleMobileAction(onToggleLightDark)} className="btn theme-toggle">
            {theme === 'dark' ? '淺色' : '深色'}
          </button>
          <button 
            onClick={() => handleMobileAction(onSetPaperTheme)} 
            className={`btn theme-toggle ${theme === 'paper' ? 'btn-primary' : ''}`}
          >
            牛皮紙
          </button>
        </div>
      </div>

      {/* Word count - at bottom */}
      <div className="word-count">
        {wordCount} 字
      </div>
    </div>
  )
}