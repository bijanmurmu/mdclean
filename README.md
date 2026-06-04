# MD Clean — Markdown Repair Tool

A versatile tool suite that takes messy copied Markdown from terminal-based AI tools, logs, or wrapped CLI output where line breaks and indentation get mangled, and automatically fixes it.

This repository contains two projects:
1. **`cli/`** - The Command Line Interface tool
2. **`website/`** - The beautifully designed, interactive web landing page

---

## 1. The CLI Tool

The `mdclean` CLI is built for developers who constantly copy-paste from terminal AI tools and need an instant way to format their clipboard.

### Key Features
- **Markdown Auto-Healing**: Safely strips terminal artifacts, joins wrapped lines, preserves lists and code blocks.
- **Clipboard Mode**: Reads the clipboard, cleans the markdown, and writes it back instantly.
- **Pipe Support**: Read from `stdin` and write to `stdout`.

### Installation

```bash
cd cli
npm install -g .
```

### Usage

```bash
# Clipboard mode (Read -> Clean -> Write)
mdclean --clipboard
# Or use the short flag
mdclean -c

# Pipe Support
cat messy.md | mdclean > clean.md

# Interactive TUI Mode (Preview changes before writing to clipboard)
mdclean
```

---

## 2. The Website (Landing Page)

A stunning, glassmorphism-inspired web interface powered by Vite, HTML, and Vanilla TypeScript. It runs the exact same AST-based Auto-Healing logic entirely in the browser!

### Running locally

```bash
cd website
npm install
npm run dev
```

### Deploying to Vercel

You can easily deploy this website to Vercel for free:

1. Push this repository to your GitHub account.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your `mdclean` repository.
4. **Crucial Step**: In the "Framework Preset" settings, choose **Vite**. 
5. In the "Root Directory" settings, click Edit and select `website`.
6. Click **Deploy**!

That's it! Your landing page will be instantly live with a clean Vercel URL.
