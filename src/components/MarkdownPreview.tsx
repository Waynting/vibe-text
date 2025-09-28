'use client'

import { ViewSettings } from '@/types'

interface MarkdownPreviewProps {
  content: string
  title: string
  viewSettings: ViewSettings
}

export function MarkdownPreview({ content, title, viewSettings }: MarkdownPreviewProps) {
  // 處理內容，確保純文字正確顯示
  const displayContent = content || '開始輸入內容...'

  return (
    <div className="editor-area">
      <div className={`editor-container direction-${viewSettings.direction}`}>
        {/* Preview content area - 純文字顯示 */}
        <div 
          className={`markdown-preview direction-${viewSettings.direction} content-area`}
          style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
        >
          {displayContent}
        </div>
      </div>
    </div>
  )
}