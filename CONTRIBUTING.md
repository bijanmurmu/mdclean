# Contributing to mdclean

First off, thank you for considering contributing to `mdclean`! We are building the most robust tool for cleaning mangled markdown, and community contributions make that possible.

## 🧠 Core Philosophy

`mdclean` prioritizes **Abstract Syntax Tree (AST)** transformations over fragile Regular Expressions. If you are submitting a fix to the core cleaning engine, please ensure your fix uses the `unified` and `remark` AST walker system to guarantee we don't break intentional markdown syntax.

## 🛠 Workflow Rules (Important!)

To keep our commit history clean and our repository stable, we follow a strict **Batch Pull Request Workflow**:

1. **Local First**: Develop, test, and verify all your changes locally. Do NOT push every small change to your fork throughout the day.
2. **End of Day PR**: Once you have fully verified all your features/fixes for the day, commit them locally. At the *end of your workday*, batch everything into **one single Pull Request**.
3. **Clean History**: If you are working on multiple features in a day, try to squash them logically before opening your end-of-day PR. 

## 🏗 Getting Started

1. Fork the repository on GitHub.
2. Clone your fork locally: `git clone https://github.com/bijanmurmu/mdclean.git`
3. If you are working on the Web Workspace:
   ```bash
   cd website
   npm install
   npm run dev
   ```
4. If you are working on the CLI:
   ```bash
   cd cli
   npm install
   npm run build
   ```

## 🐞 Reporting Bugs

If you find a markdown string that `mdclean` breaks, please open an issue and provide:
1. The **RAW Messy Markdown** (wrap it in a code block).
2. The **Expected Output**.
3. The **Actual Output** (what `mdclean` produced).

Thank you for helping us build something awesome!
