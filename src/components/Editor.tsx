'use client'

import { useRef, useEffect } from 'react'
import { ViewSettings } from '@/types'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  title: string
  viewSettings: ViewSettings
}

export function Editor({ value, onChange, title, viewSettings }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isComposing = useRef(false)

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current && !isComposing.current) {
      const newContent = editorRef.current.innerText || ''
      onChange(newContent)
    }
  }

  // 處理點擊事件，確保游標位置正確
  const handleClick = () => {
    if (editorRef.current && editorRef.current.innerText === '') {
      // 如果編輯器是空的，將游標設置到開頭
      const range = document.createRange()
      const selection = window.getSelection()
      range.setStart(editorRef.current, 0)
      range.collapse(true)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }

  // Handle composition events for CJK input
  const handleCompositionStart = () => {
    isComposing.current = true
  }

  const handleCompositionEnd = () => {
    isComposing.current = false
    handleInput()
  }

  // Handle Tab key to insert two full-width spaces
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      
      // Get current selection
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return
      
      const range = selection.getRangeAt(0)
      
      // Insert two full-width spaces
      const spaces = document.createTextNode('　　')
      range.deleteContents()
      range.insertNode(spaces)
      
      // Move cursor after the inserted spaces
      range.setStartAfter(spaces)
      range.setEndAfter(spaces)
      range.collapse(true)
      
      // Apply the new range
      selection.removeAllRanges()
      selection.addRange(range)
      
      // Force update content and cursor
      setTimeout(() => {
        handleInput()
        // Ensure cursor is visible
        if (editorRef.current) {
          const sel = window.getSelection()
          if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0)
            const rect = range.getBoundingClientRect()
            const editorRect = editorRef.current.getBoundingClientRect()
            
            // Scroll if needed to keep cursor visible
            if (rect.bottom > editorRect.bottom) {
              editorRef.current.scrollTop += rect.bottom - editorRect.bottom + 10
            } else if (rect.top < editorRect.top) {
              editorRef.current.scrollTop -= editorRect.top - rect.top + 10
            }
          }
        }
      }, 0)
    }
  }

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== value) {
      editorRef.current.innerText = value
    }
  }, [value])

  // Focus editor on mount and set cursor position
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus()
      // 設置游標到文字開頭位置
      const range = document.createRange()
      const selection = window.getSelection()
      range.setStart(editorRef.current, 0)
      range.collapse(true)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [])

  // 當檢視設定改變時，重新設置游標位置
  useEffect(() => {
    if (editorRef.current && document.activeElement === editorRef.current) {
      const range = document.createRange()
      const selection = window.getSelection()
      range.setStart(editorRef.current, 0)
      range.collapse(true)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [viewSettings.direction])

  return (
    <div className="editor-area">
      <div className={`editor-container direction-${viewSettings.direction}`}>
        {/* Title area */}
        <div className="title-area">
          <div className="title-text">{title || '未命名'}</div>
        </div>
        
        {/* Vertical divider line */}
        <div className="title-divider"></div>
        
        {/* Main content area */}
        <div
          id="editor-content"
          className={`editor-vertical direction-${viewSettings.direction} content-area`}
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onInput={handleInput}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
      </div>
    </div>
  )
}