# Iris Chess Garden

A gentle chess-learning game for Iris, with Learn Mode, Practice Mode, single-player vs Coach Owl, and local two-player mode.

## Features

- Learn Mode with mini-board piece lessons and friendly feedback.
- Practice Mode with beginner puzzles powered by FEN positions.
- Single-player mode where Iris plays a gentle Coach Owl bot.
- Two-player local mode for sharing one device, including an optional pass-to-friend pause.
- Legal move highlighting, check highlighting, captured pieces, move history, undo, restart, flip board, coordinates, and pawn promotion.
- Progressive hints that start broad and become more specific.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open the local URL Vite prints, usually `http://127.0.0.1:5173/`.

## Test

```bash
npm run test:run
```

For watch mode:

```bash
npm test
```

## Build

```bash
npm run build
```

## GitHub Pages Deployment

The app is configured for GitHub Pages at `/iris-chess-garden/` through `vite.config.ts`.

Deployment runs from `.github/workflows/deploy.yml` on pushes to `main`. The workflow installs dependencies, builds the Vite app, uploads `dist`, and deploys it with GitHub Pages.

Live site:

https://timkok.github.io/iris-chess-garden/

## Libraries Used

- React
- TypeScript
- Vite
- chess.js
- react-chessboard
- lucide-react
- Vitest

## Adding New Puzzles

Puzzles live in `src/data/puzzles.ts`.

Each puzzle needs:

- `id`: stable identifier.
- `title`: short name shown in Practice Mode.
- `goal`: one friendly instruction.
- `fen`: the board position.
- `solutions`: accepted move strings in long algebraic form, such as `e2e4` or `g7g8q` for promotion.
- `hint`: the first broad learning hint.

Keep puzzle positions small and beginner-friendly. After adding a puzzle, run:

```bash
npm run test:run
```

The test suite checks that every listed solution is legal from its puzzle FEN.

## Chess Rules

The app uses `chess.js` as the single source of truth for legal moves, turn state, check, checkmate, stalemate, draw detection, castling, en passant, and pawn promotion. UI code asks `chess.js` for legal moves and applies moves through `chess.js`, so the board should not enter illegal chess positions.
