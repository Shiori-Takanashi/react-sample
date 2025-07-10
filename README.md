# React Sample Project

このプロジェクトは、React + TypeScript + Viteを使用したチャットアプリケーションのサンプルです。

## プロジェクト構成

- **React Chat App**: モダンなチャットアプリケーション（React + TypeScript + Vite）
- **Sample**: HTML/JavaScript/Pythonのサンプルコード

## Getting Started

### React Chat App

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

### Python サンプル

```bash
# 仮想環境の作成・有効化
python -m venv .venv
.venv\Scripts\activate  # Windows

# 依存関係のインストール
pip install -r requirements.txt

# スクリプトの実行
python sample/scripts/init_db.py
python sample/scripts/db_to_json.py
```

## 技術スタック

### Frontend
- React 18
- TypeScript
- Vite
- CSS3

### Backend/Data
- Python 3.12
- SQLite

## Features

### Chat App
- リアルタイムチャット風UI
- レスポンシブデザイン
- TypeScriptによる型安全性

### Sample
- データベース操作
- JSON変換
- HTML/CSS/JavaScriptの基本実装

## Development

### React Chat App

```js
// Vite + React + TypeScript設定
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
