'use client'

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
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  viewSettings: ViewSettings
  onViewSettingsChange: (settings: ViewSettings) => void
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
  onViewSettingsChange 
}: ToolbarProps) {

  const handleDirectionToggle = () => {
    const newDirection = viewSettings.direction === 'rtl' ? 'ltr' : 'rtl'
    onViewSettingsChange({
      ...viewSettings,
      direction: newDirection
    })
  }

  return (
    <div className="toolbar">
      {/* File operations */}
      <div className="section">
        <div className="btn-group-row">
          <button onClick={onNew} className="btn">新建</button>
          <button onClick={onOpen} className="btn">開啟</button>
        </div>
        <div className="btn-group-row" style={{marginTop: '4px'}}>
          <button onClick={onSave} className="btn">儲存</button>
          <button onClick={onSaveAs} className="btn">另存</button>
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
        <button onClick={handleDirectionToggle} className="btn theme-toggle">
          {viewSettings.direction === 'rtl' ? '右起' : '左起'}
        </button>
      </div>

      {/* Theme toggle */}
      <div className="section">
        <div className="section-title">主題</div>
        <button onClick={onToggleTheme} className="btn theme-toggle">
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