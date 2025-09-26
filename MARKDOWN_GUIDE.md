# Vibe Text Markdown 使用說明

## 概述

Vibe Text 現在支援 Markdown 格式的文件編輯與儲存。文件將以標準的 YAML frontmatter 格式儲存 metadata。

## 檔案格式

### 支援的檔案類型
- `.md` - Markdown 檔案（預設）
- `.txt` - 純文字檔案

### Markdown 文件結構

每個 Markdown 文件包含兩個部分：

1. **YAML Frontmatter**（文件開頭的 metadata）
2. **內容區域**（你的文章內容）

範例：

```markdown
---
title: "文章標題"
date: "2025-09-22T21:40:00+08:00"
categories: ["分類1", "分類2"]
summary: "文章摘要"
slug: "url-slug"
id: "2025-0922-2140"
---

這裡是你的文章內容...
```

## Metadata 欄位說明

### 基本資訊
- **標題 (title)**: 文章的主要標題
- **編號 (id)**: 文件的唯一識別碼，系統會自動產生
- **日期 (date)**: 文件建立或修改的日期時間

### 進階資訊（可收合）
點擊「進階資訊」可以展開以下欄位：

- **文件說明 (description)**: 詳細的文件描述
- **摘要 (summary)**: 簡短的文章摘要
- **分類 (categories)**: 文章分類標籤，以逗號分隔
- **網址代稱 (slug)**: 用於 URL 的簡短識別名稱

## 使用方式

### 建立新文件
1. 點擊「新建」按鈕
2. 開始輸入內容
3. 在側邊欄填寫文件資訊
4. 儲存時會自動以 Markdown 格式儲存

### 開啟檔案
1. 點擊「開啟」按鈕
2. 選擇 .md 或 .txt 檔案
3. 系統會自動識別並解析 metadata

### 儲存檔案
- **儲存 (Ctrl/Cmd + S)**: 覆蓋原檔案
- **另存 (Ctrl/Cmd + Shift + S)**: 儲存為新檔案

### 編輯 Metadata
1. 在側邊欄直接編輯基本資訊
2. 點擊「進階資訊」展開更多欄位
3. 分類欄位支援多個標籤，用逗號分隔

## 快捷鍵

- `Ctrl/Cmd + N`: 新建文件
- `Ctrl/Cmd + O`: 開啟檔案
- `Ctrl/Cmd + S`: 儲存
- `Ctrl/Cmd + Shift + S`: 另存新檔

## 注意事項

1. 編輯器會自動在儲存時加入 YAML frontmatter
2. 如果開啟純文字檔案，仍可編輯並另存為 Markdown
3. 所有 metadata 欄位都是選填的
4. 日期格式遵循 ISO 8601 標準