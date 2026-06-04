# MD Clean — Markdown Repair CLI

A small CLI that takes messy copied Markdown from terminal-based AI tools, logs, or wrapped CLI output where line breaks and indentation get mangled, and automatically fixes it.

## Key Features

1. **Markdown Auto-Healing**: 
   - Safely strips terminal indentation artifacts.
   - Intelligently joins wrapped lines broken by terminal width.
   - Seamlessly ignores fenced code blocks so your code syntax remains untouched.
   - Converts deeply indented lists back into properly parsed markdown lists.
2. **Clipboard Mode**: Automatically reads the clipboard, cleans the markdown, and writes it back immediately.
3. **Pipe Support**: Read from `stdin` and write to `stdout` (`cat messy.md | mdclean > clean.md`).
4. **AI Mode**: Dedicated alias for Clipboard mode geared towards AI CLI usage (e.g. ChatGPT CLI, Claude Code).
5. **Interactive TUI**: Run without arguments to preview the cleaned text before writing it to your clipboard.

## Installation

You can install `mdclean` globally via npm. First clone the repository, then run:

```bash
npm install -g .
```

## Usage

```bash
# Clipboard mode (Read -> Clean -> Write)
mdclean --clipboard
# Or use the short flag
mdclean -c

# AI output fixer mode
mdclean --ai

# Pipe Support
cat messy.md | mdclean > clean.md

# Interactive TUI Mode (Reads clipboard, shows preview, and asks before modifying clipboard)
mdclean
```
