// Lemma drawing kit: the icon, sample launches, a seeded equity curve and the cost model every mockup shares.
// Runs as a classic script in pages and through import() in Node, so it only touches globalThis.
(function (g) {
  const paint = (id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) =>
    `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
  const radial = (id, stops, cx = 0.5, cy = 0.5, r = 0.5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;
  function tilePath(cx = 512, cy = 512, half = 448, n = 5) {
    const pts = [];
    for (let i = 0; i < 240; i++) { const t = (i / 240) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
      pts.push(`${(cx + half * Math.sign(c) * Math.abs(c) ** (2 / n)).toFixed(1)} ${(cy + half * Math.sign(s) * Math.abs(s) ** (2 / n)).toFixed(1)}`); }
    return `M ${pts.join(' L ')} Z`;
  }
  // The mark: ∴, "therefore". A lemma is a small proof you build on, and Lemma proves a strategy before you trade it.
  function iconSVG({ small = false, uid = 'i', size = 1024 } = {}) {
    const T = tilePath();
    const defs = `<defs>${paint(`${uid}tile`, [[0, '#2c2c2e'], [1, '#0a0a0b']])}${paint(`${uid}rim`, [[0, '#fff', 0.34], [0.4, '#fff', 0.06], [1, '#fff', 0.12]])}
      ${radial(`${uid}dot`, [[0, '#ffe7a3'], [0.45, '#ffb340'], [1, '#e8750c']], 0.38, 0.32, 0.7)}
      <filter id="${uid}sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity=".3"/></filter>
      <filter id="${uid}gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="26"/></filter></defs>`;
    const tile = `<g ${small ? '' : `filter="url(#${uid}sh)"`}><path d="${T}" fill="url(#${uid}tile)"/></g>`;
    const edge = small ? '' : `<path d="${T}" fill="none" stroke="url(#${uid}rim)" stroke-width="3"/>`;
    const r = small ? 122 : 104, pts = [[512, 330], [330, 650], [694, 650]];
    const art = (small ? '' : pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ff9f0a" filter="url(#${uid}gl)" opacity=".42"/>`).join('')) +
      pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${uid}dot)"/>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="${size}" height="${size}">${defs}${tile}${art}${edge}</svg>`;
  }
  const mark = (uid, size = 24) => iconSVG({ small: true, uid, size });

  // Seeded random numbers, so every render shows the same sample market.
  function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  // Made-up addresses. Pump.fun mints end in "pump", so the sample ones do too.
  const addr = (seed, pump = true) => { const r = rng(seed); let s = ''; for (let i = 0; i < (pump ? 40 : 44); i++) s += B58[Math.floor(r() * 58)]; return pump ? s + 'pump' : s; };
  const short = (a) => `${a.slice(0, 4)}…${a.slice(-4)}`;

  const IMG = '../../assets/third-party/';
  // Sample tokens. Tickers are invented; the pictures are credited CC0 photos of animals.
  const TOKENS = [
    { t: 'SNIFF', img: 'token-sniff.jpg' }, { t: 'RIBBIT', img: 'token-ribbit.jpg' }, { t: 'WADDLE', img: 'token-waddle.jpg' },
    { t: 'CHONK', img: 'token-chonk.jpg' }, { t: 'CAPY', img: 'token-capy.jpg' }, { t: 'YAWN', img: 'token-yawn.jpg' },
  ].map((x, i) => ({ ...x, img: IMG + x.img, ca: addr(1000 + i) }));

  // The launch feed the hero replays: stage, age, market cap, dev share, top 10 share, bundle flag.
  function feed(n = 40, seed = 7) {
    const r = rng(seed), out = [];
    for (let i = 0; i < n; i++) {
      const tk = TOKENS[i % TOKENS.length];
      const dev = Math.round(r() * 14 * 10) / 10, top = Math.round(12 + r() * 46), bundle = r() < 0.28;
      out.push({ ...tk, mc: 4 + r() * 60, holders: Math.round(20 + r() * 420), dev, top, bundle, pass: dev < 5 && top < 30 && !bundle, age: Math.round(2 + r() * 50) });
    }
    return out;
  }

  // An equity curve in SOL. gross is before costs; net subtracts the cost model on every trade.
  function curve(n = 160, seed = 11) {
    const r = rng(seed); let gross = 0, net = 0; const pts = [];
    for (let i = 0; i < n; i++) {
      const move = (r() - 0.43) * 0.9 + (r() < 0.04 ? 2.4 : 0) - (r() < 0.05 ? 1.3 : 0);
      gross += move * 0.36; net += move * 0.36 - 0.08;
      pts.push([gross, net]);
    }
    const k = 31.2 / gross; // scale so the sample lands on round, readable totals
    return pts.map(([a, b], i) => [a * k, (b * k) * (18.4 / (net * k))]).map(([a, b], i) => [a, b]);
  }

  // What one trade really costs on Axiom-style terminals, in SOL, for a 0.5 SOL buy and its sell.
  const COSTS = [
    ['Platform fee', 'Axiom charges 0.75 to 0.95% each way. Lemma uses your tier.', 5.31],
    ['Priority fees', 'Paid to land in the next block.', 2.62],
    ['Tips', 'Paid to block builders for MEV protection.', 1.74],
    ['Slippage', 'Modeled from the pool depth at the moment of the trade.', 3.12],
  ];

  const BRAND = {
    name: 'Lemma',
    headline: 'Prove it before you ape.',
    sub: 'Replay real launches. Test your exits with every fee counted. No keys needed.',
    ticker: ['No private keys', 'No Axiom login', 'No browser extension', 'No server', 'Every fee counted', 'Open source', '$0'],
    gradientNote: '',
    swatches: [['#000000', 'Page', '#f5f5f7'], ['#1c1c1e', 'Surface', '#f5f5f7'], ['#141416', 'Panel', '#f5f5f7'], ['#ff9f0a', 'Proof', '#000000'], ['#30d158', 'Gain', '#000000'], ['#ff6961', 'Loss', '#000000']],
  };

  g.Kit = { paint, radial, tilePath, iconSVG, mark, rng, addr, short, TOKENS, feed, curve, COSTS, BRAND, SMALL_MAX: 64 };
})(globalThis);
