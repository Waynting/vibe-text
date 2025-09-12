# Vibe Text - 直式文字編輯器

一個優雅的直式中文文字編輯器，支援傳統由右至左的書寫方式。

## ✨ 功能特色

- 📝 **直式文字編輯** - 支援傳統中文由右至左、由上至下的書寫方式
- 🎨 **雙主題切換** - 淺色與深色主題自由切換
- 💾 **本地檔案操作** - 開啟、儲存純文字檔案，完全離線使用
- ⌨️ **快捷鍵支援** - Cmd+S 儲存、Cmd+Shift+S 另存新檔、Tab 段落縮排
- 📊 **即時字數統計** - 智慧計算中文字元與英文單詞
- 🔄 **文字方向切換** - 支援右起與左起兩種書寫方向
- 📋 **文件說明** - 為每個文件添加詳細說明

## 📥 下載

### 🌐 網頁版（推薦）
**[🚀 立即使用 - vibe-text.vercel.app](https://vibe-text.vercel.app)**

無需安裝，直接在瀏覽器中使用！

### 🖥️ 桌面版

**一鍵下載最新版本：**

<div align="center">

[![Download for macOS](https://img.shields.io/badge/🍎_macOS-下載_DMG-blue?style=for-the-badge&logoColor=white)](https://github.com/waynting/vibe-text/releases/latest)
[![Download for Windows](https://img.shields.io/badge/🪟_Windows-下載_EXE-green?style=for-the-badge&logoColor=white)](https://github.com/waynting/vibe-text/releases/latest)

</div>

或從 [GitHub Releases](https://github.com/waynting/vibe-text/releases) 檢視所有版本。

| 平台 | 檔案類型 | 說明 |
|------|----------|------|
| 🍎 **macOS** | `.dmg` | 支援 Intel 和 Apple Silicon Mac |
| 🪟 **Windows** | `.exe` | Windows 10/11 x64 安裝程式 |

> 💡 **提示**: 下載後直接安裝即可使用。macOS 用戶可能需要在「系統偏好設定 > 安全性與隱私」中允許應用程式執行。

## 🚀 快速開始

### 網頁版
1. 訪問 [vibe-text.vercel.app](https://vibe-text.vercel.app)
2. 開始書寫！

### 桌面版
1. 下載對應平台的安裝檔
2. 安裝應用程式
3. 開啟 Vibe Text
4. 開始享受直式書寫體驗

## ⌨️ 快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `Cmd/Ctrl + N` | 新建文件 |
| `Cmd/Ctrl + O` | 開啟文件 |
| `Cmd/Ctrl + S` | 儲存文件 |
| `Cmd/Ctrl + Shift + S` | 另存新檔 |
| `Tab` | 插入兩個全形空格（段落縮排） |

## 📄 支援格式

- **檔案格式**: 純文字 `.txt` 檔案
- **編碼**: UTF-8
- **文字方向**: 右至左（傳統）或左至右
- **字體**: 宋體/SimSun/Noto Serif CJK SC

## 🔧 開發

### 環境需求
- Node.js 18+
- Rust
- Tauri CLI

### 本地開發
```bash
# 克隆專案
git clone https://github.com/waynting/vibe-text.git
cd vibe-text

# 安裝依賴
npm install

# 開發模式
npm run tauri:dev

# 建構應用程式
npm run tauri:build
```

### 網頁版開發
```bash
# 開發伺服器
npm run dev

# 建構靜態網站
npm run build
```

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

1. Fork 此專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📜 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

## 🙏 致謝

- 使用 [Tauri](https://tauri.app/) 建構跨平台桌面應用程式
- 使用 [Next.js](https://nextjs.org/) 建構網頁版本
- 使用 [Tailwind CSS](https://tailwindcss.com/) 進行樣式設計

---

🤖 *Built with [Claude Code](https://claude.ai/code)*