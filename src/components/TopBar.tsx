'use client'

import { useState } from 'react'
import { DocMeta, ViewSettings } from '@/types'

interface TopBarProps {
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
}

export function TopBar({ 
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
  onViewSettingsChange
}: TopBarProps) {
  const [isMetadataExpanded, setIsMetadataExpanded] = useState(false)

  // 移除方向切換功能，現在固定使用橫式排版

  return (
    <div className="top-bar">
      {/* 第一行：檔案操作和基本資訊 */}
      <div className="top-bar-row">
        {/* 檔案操作 */}
        <div className="top-bar-section">
          <button onClick={onNew} className="btn">新建</button>
          <button onClick={onOpen} className="btn">開啟</button>
          <button onClick={onSave} className="btn">儲存</button>
          <button onClick={onSaveAs} className="btn">另存</button>
        </div>

        {/* 標題 */}
        <div className="top-bar-section flex-1">
          <input
            type="text"
            value={meta.title}
            onChange={(e) => setMeta({ title: e.target.value })}
            placeholder="文件標題"
            className="title-input"
          />
        </div>

        {/* 詳細資訊按鈕 */}
        <div className="top-bar-section">
          <button 
            onClick={() => setIsMetadataExpanded(!isMetadataExpanded)}
            className="btn"
          >
            {isMetadataExpanded ? '收起' : '詳細'}
          </button>
        </div>

        {/* 主題控制 */}
        <div className="top-bar-section">
          <button onClick={onToggleLightDark} className="btn">
            {theme === 'dark' ? '淺色' : '深色'}
          </button>
          <button 
            onClick={onSetPaperTheme} 
            className={`btn ${theme === 'paper' ? 'btn-primary' : ''}`}
          >
            牛皮紙
          </button>
        </div>

        {/* 字數 */}
        <div className="top-bar-section">
          <span className="word-count-display">{wordCount} 字</span>
        </div>
      </div>

      {/* 第二行：進階資訊（可收合） */}
      {isMetadataExpanded && (
        <div className="top-bar-metadata">
          <div className="metadata-grid">
            {/* 檔案資訊 */}
            <div className="metadata-group">
              <label>檔名</label>
              <input
                type="text"
                value={fileName || ''}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="輸入檔名"
                className="small-input"
              />
            </div>
            
            <div className="metadata-group">
              <label>編號</label>
              <input
                type="text"
                value={meta.id}
                onChange={(e) => setMeta({ id: e.target.value })}
                placeholder="文件編號"
                className="small-input"
              />
            </div>

            <div className="metadata-group">
              <label>分類</label>
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
                className="small-input"
              />
            </div>

            <div className="metadata-group">
              <label>網址代稱</label>
              <input
                type="text"
                value={meta.slug || ''}
                onChange={(e) => setMeta({ slug: e.target.value })}
                placeholder="url-slug"
                className="small-input"
              />
            </div>

            <div className="metadata-group">
              <label>摘要</label>
              <input
                type="text"
                value={meta.summary || ''}
                onChange={(e) => setMeta({ summary: e.target.value })}
                placeholder="文章摘要"
                className="small-input"
              />
            </div>

            <div className="metadata-group">
              <label>說明</label>
              <input
                type="text"
                value={meta.description || ''}
                onChange={(e) => setMeta({ description: e.target.value })}
                placeholder="文件說明"
                className="small-input"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}