'use client'

import { useRef, useEffect, useState } from 'react'
import { ViewSettings } from '@/types'
import { MarkdownPreview } from './MarkdownPreview'

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
      // 使用 innerHTML 並處理 <br> 標籤轉換為換行符
      const htmlContent = editorRef.current.innerHTML
      const textContent = htmlContent
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<div><br><\/div>/gi, '\n')
        .replace(/<div>(.*?)<\/div>/gi, '\n$1')
        .replace(/<[^>]*>/g, '') // 移除所有其他 HTML 標籤
      onChange(textContent)
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

  // Handle Tab key to insert two full-width spaces and Enter for new lines
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
    } else if (e.key === 'Enter') {
      // 確保 Enter 鍵可以正常換行
      e.preventDefault()
      
      // 獲取當前選擇
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return
      
      const range = selection.getRangeAt(0)
      
      // 簡單插入單個換行符
      const br = document.createElement('br')
      range.deleteContents()
      range.insertNode(br)
      
      // 移動游標到換行符後面
      range.setStartAfter(br)
      range.setEndAfter(br)
      range.collapse(true)
      
      selection.removeAllRanges()
      selection.addRange(range)
      
      // 更新內容
      setTimeout(() => {
        handleInput()
      }, 0)
    }
  }

  // Update editor content when value changes or when switching back from preview mode
  useEffect(() => {
    if (editorRef.current) {
      // 將換行符轉換為 <br> 標籤以正確顯示
      const htmlContent = value.replace(/\n/g, '<br>')
      if (editorRef.current.innerHTML !== htmlContent) {
        editorRef.current.innerHTML = htmlContent
      }
    }
  }, [value, viewSettings.isPreviewMode])

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

  // 當檢視設定改變時，重新設置游標位置和對焦
  useEffect(() => {
    if (editorRef.current && !viewSettings.isPreviewMode) {
      // 如果不是在預覽模式，重新對焦編輯器
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus()
          const range = document.createRange()
          const selection = window.getSelection()
          if (editorRef.current.childNodes.length > 0) {
            range.setStartAfter(editorRef.current.lastChild!)
          } else {
            range.setStart(editorRef.current, 0)
          }
          range.collapse(true)
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      }, 0)
    }
  }, [viewSettings.direction, viewSettings.isPreviewMode])

  // 如果是預覽模式，顯示 Markdown 預覽
  if (viewSettings.isPreviewMode) {
    return <MarkdownPreview content={value} title={title} viewSettings={viewSettings} />
  }

  return (
    <div className="editor-area">
      {/* 編輯器容器 */}
      <div className={`editor-container direction-${viewSettings.direction}`}>
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