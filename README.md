<div align="center">
  <img src="website/public/favicon.svg" width="100" height="100" alt="mdclean logo">
  <h1>mdclean</h1>
  <p><strong>The Markdown Repair Tool</strong></p>
  <p>Instantly fix broken, wrapped, and malformed Markdown copied from AI tools or messy terminals.</p>
</div>

<br>

## What is mdclean?

If you frequently copy output from terminal-based AI tools (like Claude, ChatGPT wrappers, or raw CLI logs), you've likely dealt with "broken markdown."
Terminals often hard-wrap text at 80 characters, causing line breaks in the middle of paragraphs. They also frequently inject random leading spaces that break nested lists and ruin indented code blocks.

**`mdclean`** is a toolsuite built to fix this instantly.

Instead of relying on fragile string concatenation (RegEx), `mdclean` uses a full **Abstract Syntax Tree (AST)** engine powered by `unified` and `remark`. It completely understands your document structure, allowing it to unwrap paragraphs and fix global indentation without destroying your intentional formatting.

---

## 🚀 The Tools

This repository is a monorepo containing two core projects:

### 1. The Web Workspace (`/website`)

A stunning, cyber-brutalist web application designed for developers. It runs the exact same AST-based Auto-Healing logic entirely in your browser.

- **Dual Mode**: Features a clean landing page and a massive 100vh full-screen editor workspace.
- **GitHub Preview**: Instantly compile your cleaned output to view it exactly as GitHub would render it.
- **Tech Stack**: Vanilla TypeScript + Vite + `github-markdown-css`.

#### Running Locally
```bash
cd website
npm install
npm run dev
```

### 2. The Command Line Interface (`/cli`)

Built for power users who want to fix markdown without leaving the terminal.

#### Installation
```bash
cd cli
npm install -g .
```

#### Usage
```bash
# Clipboard Mode: Reads clipboard -> Cleans AST -> Writes back to clipboard
mdclean -c

# Pipe Mode: Standard unix streams
cat messy.md | mdclean > clean.md

# TUI Mode: Interactive terminal UI
mdclean
```

---

## 🧠 How the Engine Works

The core cleaning engine (found in `website/src/cleaner.ts` and mirrored in the CLI) executes a multi-pass process:

1. **Global Indentation Normalization**: Detects the common "1-extra-space" bug caused by AI chatbots and intelligently strips it only if it's safe to do so.
2. **AST Parsing**: Converts the raw text into a mdast (Markdown Abstract Syntax Tree).
3. **Smart Un-wrapping**: Walks the AST to find `paragraph` nodes (including those inside `listItem` or `blockquote` nodes) and converts soft-breaks into spaces, perfectly healing hard-wrapped terminal outputs.
4. **Re-Stringification**: Compiles the AST back into perfectly canonical, standard markdown.

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) to learn about our workflow, which prioritizes local testing and batched end-of-day Pull Requests.

Please also ensure you follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
