
# Imposter - Spy Party Game

Imposter is a Progressive Web App (PWA) for playing the classic spy party game with friends. Built with React, TypeScript, Vite, and Tailwind CSS, it supports both English and Farsi languages and works offline.

## Game Description

Imposter is a social deduction game for 3 or more players. In each round:

- A random word is chosen from selected categories (e.g., Fruits, Animals, Jobs).
- One player is secretly assigned as the "Spy" and does not see the word.
- Each player, in turn, taps their card to reveal their role: either the word (if not the spy) or "You are the SPY".
- After all players have seen their card, a timer starts for group discussion.
- The goal is for the spy to guess the word, while others try to identify the spy.

## Features

- Multi-language support (English & Farsi)
- Dark mode UI
- PWA: installable, offline support
- Customizable number of players, round duration, and word categories
- Infinite rounds with word usage tracking
- Responsive design for mobile and desktop

## Getting Started

### Install & Run

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
pnpm run build
```

## How to Play

1. Set the number of players and round duration.
2. Select word categories (or use all).
3. Start the game. Each player taps to reveal their card.
4. The spy sees "You are the SPY"; others see the word.
5. After all players, a timer counts down for discussion.
6. Start the next round when ready.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- vite-plugin-pwa
- vite-plugin-yaml2

## License

MIT
