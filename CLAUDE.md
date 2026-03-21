# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Type-check (tsc -b) then bundle with Vite
npm run lint      # ESLint across all source files
npm run preview   # Serve the production build locally
```

There are no tests. TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`) acts as the primary safety net — the build will fail on unused imports or variables.

## Environment

Requires `VITE_ANTHROPIC_API_KEY` in a `.env` file (never committed). The Anthropic SDK is initialized in `src/api/client.ts` with `dangerouslyAllowBrowser: true` — this is intentional for the dev/local use case.

## Architecture

The app is a single-page React app. The core mental model is a **conversation tree** — one root conversation (the main chat) plus any number of nested sub-conversations branching off highlighted text.

### State (Zustand stores)

Three stores in `src/store/`:

- **`conversationStore`** — owns the entire `ConversationTree` (a `Record<id, Conversation>` + `activeSubWindowIds` stack). All streaming, message mutation, and sub-window lifecycle goes through here. The `activeSubWindowIds` array is an ordered stack: the last entry is the visible sub-window.
- **`selectionStore`** — owns the current text selection, its viewport position (`DOMRect`), and the popover's streaming state (`idle → loading → answered`).
- **`uiStore`** — theme only (`dark`/`light`), applied as `data-theme` on `<html>`.

### Data flow for the highlight-to-ask feature

1. `useTextSelection` (hook) fires on `mouseup` inside a `ChatThread` container, walks up the DOM to find `[data-message-id]` / `[data-conversation-id]` attributes, then calls `selectionStore.setSelection()`.
2. `SelectionActionButton` (portal, `position: fixed`) reads the selection rect and renders above the highlighted text. On click it streams a micro-answer into `selectionStore` via `appendPopoverChunk`.
3. `HighlightPopover` (portal, `position: fixed`) shows the streaming answer. "Expand" calls `conversationStore.createSubConversation()` then `openSubWindow()`.
4. `SubWindowStack` renders the active sub-window(s). Each `SubWindowThread` has its own `ChatThread` + `ChatInput` + its own instance of `useTextSelection`, enabling further nesting.

### Sub-window stacking

`SubWindowStack` is a fixed-width (480px) panel to the right of `MainPanel`. Sub-windows **stack on top of each other** (not side-by-side) using `position: absolute inset-0` + Framer Motion `AnimatePresence`. Only the last item in `activeSubWindowIds` is fully visible. Closing a sub-window also closes all descendants (same-or-deeper `depth` values).

### API context building

`buildSubWindowMessages()` in `src/utils/treeUtils.ts` constructs the message array for sub-window API calls: last 4 messages from the parent conversation → context injection block quoting the highlighted text → the sub-conversation's own messages. Each conversation is a fully independent API context (no shared Anthropic session).

### Styling

CSS custom properties (`--color-*`, `--gradient-*`, `--glow-*`) are defined in `src/index.css` for both themes and are the source of truth for all colors. Tailwind utilities reference these via `var(...)` in `style` props or via the extended theme in `tailwind.config.js`. The `@tailwindcss/typography` plugin styles markdown output inside `.prose` elements.
