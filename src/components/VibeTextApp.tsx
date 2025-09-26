'use client'

import { useState, useEffect, useCallback } from 'react'
import { Editor } from './Editor'
import { Sidebar } from './Sidebar'
import { DocumentState, DocMeta, ViewSettings } from '@/types'
import { useWordCount } from '@/hooks/useWordCount'
import { openFile, saveFile, saveAsFile } from '@/utils/fileOperations'

function generateDocumentId(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}${day}-${time}`
}

function getCurrentDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function createNewDocument(): DocumentState {
  return {
    meta: {
      id: generateDocumentId(),
      title: '未命名',
      date: new Date().toISOString(),
      wordCount: 0,
      description: '',
      categories: [],
      summary: '',
      slug: '',
    },
    content: '',
    filePath: undefined,
    fileName: '',
    isDirty: false,
  }
}

export default function VibeTextApp() {
  const [document, setDocument] = useState<DocumentState>(createNewDocument)
  const [theme, setTheme] = useState<'light' | 'dark' | 'paper'>('light')
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    direction: 'rtl', // 預設為傳統中文從右到左
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const wordCount = useWordCount(document.content)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'paper'
    if (savedTheme && ['light', 'dark', 'paper'].includes(savedTheme)) {
      setTheme(savedTheme)
      window.document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  // Toggle between light and dark theme
  const toggleLightDark = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'light' : 'light'
    setTheme(newTheme)
    
    // Force theme update on document element
    const root = window.document.documentElement
    root.setAttribute('data-theme', newTheme)
    
    // Force style recalculation
    root.style.display = 'none'
    root.offsetHeight // Force reflow
    root.style.display = ''
    
    localStorage.setItem('theme', newTheme)
    
    // Force update all text elements
    setTimeout(() => {
      const editor = window.document.getElementById('editor-content')
      if (editor) {
        editor.style.color = getComputedStyle(root).getPropertyValue('--text-primary')
      }
    }, 0)
  }, [theme])

  // Set paper theme
  const setPaperTheme = useCallback(() => {
    const newTheme = 'paper'
    setTheme(newTheme)
    
    // Force theme update on document element
    const root = window.document.documentElement
    root.setAttribute('data-theme', newTheme)
    
    // Force style recalculation
    root.style.display = 'none'
    root.offsetHeight // Force reflow
    root.style.display = ''
    
    localStorage.setItem('theme', newTheme)
    
    // Force update all text elements
    setTimeout(() => {
      const editor = window.document.getElementById('editor-content')
      if (editor) {
        editor.style.color = getComputedStyle(root).getPropertyValue('--text-primary')
      }
    }, 0)
  }, [])

  // Update word count in meta when it changes
  useEffect(() => {
    setDocument(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        wordCount
      }
    }))
  }, [wordCount])

  // Handle content changes
  const handleContentChange = useCallback((newContent: string) => {
    setDocument(prev => ({
      ...prev,
      content: newContent,
      isDirty: true,
    }))
  }, [])
  

  // Handle meta data changes
  const handleMetaChange = useCallback((newMeta: Partial<DocMeta>) => {
    setDocument(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        ...newMeta,
      },
      isDirty: true,
    }))
  }, [])

  // Handle filename changes
  const handleFileNameChange = useCallback((fileName: string) => {
    setDocument(prev => ({
      ...prev,
      fileName,
      isDirty: true,
    }))
  }, [])

  // File operations
  const handleNew = useCallback(() => {
    if (document.isDirty) {
      const confirmed = window.confirm('未儲存，確定新建？')
      if (!confirmed) return
    }
    setDocument(createNewDocument())
  }, [document.isDirty])

  const handleOpen = useCallback(async () => {
    try {
      if (document.isDirty) {
        const confirmed = window.confirm('未儲存，確定開啟？')
        if (!confirmed) return
      }

      const result = await openFile()
      if (!result) return

      // Extract filename from file path (handle both real paths and web: prefixed paths)
      const cleanPath = result.filePath.startsWith('web:') ? result.filePath.substring(4) : result.filePath
      const fileName = cleanPath.split('/').pop()?.replace(/\.(txt|md)$/, '') || ''
      
      setDocument({
        meta: {
          id: result.meta.id || generateDocumentId(),
          title: result.meta.title || fileName || '未命名',
          date: result.meta.date || new Date().toISOString(),
          wordCount: 0,
          description: result.meta.description || '',
          categories: result.meta.categories || [],
          summary: result.meta.summary || '',
          slug: result.meta.slug || '',
        },
        content: result.content,
        filePath: result.filePath,
        fileName: fileName,
        isDirty: false,
      })
    } catch (error) {
      alert(error instanceof Error ? error.message : '開啟失敗')
    }
  }, [document.isDirty])

  const handleSaveAs = useCallback(async () => {
    try {
      const filePath = await saveAsFile(document, true, document.fileName, 'md')
      if (filePath) {
        setDocument(prev => ({
          ...prev,
          filePath,
          isDirty: false,
        }))
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '另存失敗')
    }
  }, [document])

  const handleSave = useCallback(async () => {
    try {
      // 檢查是否有真實的檔案路徑（非瀏覽器環境的虛擬路徑）
      const hasRealFilePath = document.filePath && !document.filePath.startsWith('web:')
      
      if (hasRealFilePath) {
        // 有真實檔案路徑，直接覆蓋儲存
        const format = document.filePath?.endsWith('.txt') ? 'txt' : 'md'
        const filePath = await saveFile(document, true, undefined, format)
        if (filePath) {
          setDocument(prev => ({
            ...prev,
            isDirty: false,
          }))
        }
      } else {
        // 沒有真實檔案路徑，呼叫另存功能
        await handleSaveAs()
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '儲存失敗')
    }
  }, [document, handleSaveAs])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault()
            handleNew()
            break
          case 'o':
            e.preventDefault()
            handleOpen()
            break
          case 's':
            e.preventDefault()
            if (e.shiftKey) {
              handleSaveAs()
            } else {
              handleSave()
            }
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNew, handleOpen, handleSave, handleSaveAs])

  return (
    <div className="app-container">
      {/* Main editor */}
      <Editor
        value={document.content}
        onChange={handleContentChange}
        title={document.meta.title}
        viewSettings={viewSettings}
      />
      

      {/* Mobile toolbar open button - show when collapsed */}
      {!isMobileMenuOpen && (
        <button
          className="mobile-open-button md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="開啟選單"
        >
          ≡
        </button>
      )}
      
      {/* Minimal toolbar */}
      <Sidebar
        meta={document.meta}
        setMeta={handleMetaChange}
        wordCount={wordCount}
        filePath={document.filePath}
        fileName={document.fileName}
        setFileName={handleFileNameChange}
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        theme={theme}
        onToggleLightDark={toggleLightDark}
        onSetPaperTheme={setPaperTheme}
        viewSettings={viewSettings}
        onViewSettingsChange={setViewSettings}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />
    </div>
  )
}