# Lemma design source

Everything in `assets/brand`, `assets/mockups` and `assets/readme` renders from this folder.

```bash
npm install
npx playwright install chromium
node render.mjs all
```

`node render.mjs icon`, `stills` or `gifs` renders one group, and `node render.mjs gifs hero` renders one file. GIFs also need `ffmpeg` and `gifsicle` on your `PATH`, and the icon step needs Python with Pillow.

## Direction

- **A terminal, not a dashboard.** Dense rows, 12.5px type, tabular figures everywhere, thin separators instead of cards.
- **Amber is proof:** the ∴ mark, your strategy and every result after costs. It's the old terminal amber on purpose.
- **Green and red are profit and loss** and nothing else, always with a sign.
- **Addresses use a monospace face**, because one wrong character is a different address.
- **Type:** SF Pro on Apple devices, Inter everywhere else, SF Mono or Geist Mono for addresses.

`src/kit.js` holds the seeded sample market, so every render shows the same launches, addresses and curve. Each scene is one HTML file in `src/`, and animated scenes expose `window.seek(t)`.
