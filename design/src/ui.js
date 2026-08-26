// Window chrome, icons, charts and timeline helpers shared by the mockup pages.
if (globalThis.document && document.fonts) document.fonts.load('500 16px "Geist Mono"');
(function (g) {
  const ICONS = {
    replay: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="m10 9 5 3-5 3z"/>',
    paper: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M9 13h6M9 17h4"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    receipt: '<path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 1 .7V2l-3 2-3-2-3 2-3-2-3 2z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    puzzle: '<path d="M19.4 14.6a2.5 2.5 0 1 0-3.4-3.4l-1-1 2.6-2.6a1 1 0 0 0 0-1.4L15.2 3.8a1 1 0 0 0-1.4 0L11.2 6.4l-1-1a2.5 2.5 0 1 0-3.4 3.4l1 1-2.6 2.6a1 1 0 0 0 0 1.4l2.4 2.4a1 1 0 0 0 1.4 0l2.6-2.6 1 1a2.5 2.5 0 1 0 3.4 3.4"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    play: '<path d="m7 4 13 8-13 8z"/>',
    flag: '<path d="M4 22V4a1 1 0 0 1 1-1h12l-2 4 2 4H5"/>',
    wallet: '<path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3v3a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5"/>',
  };
  const icon = (name, size = 16, sw = 1.75) => `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;

  const NAV = { Test: [['Backtest', 'replay'], ['Paper trade', 'paper']], Check: [['Rug check', 'shield'], ['Wallet watch', 'eye']], Books: [['Journal', 'book'], ['Taxes', 'receipt']], Safety: [['Extensions', 'puzzle']] };
  const sidebar = (active) => `<aside class="side">
      <div class="lights"><i></i><i></i><i></i></div>
      ${Object.entries(NAV).map(([grp, items]) => `<h4>${grp}</h4>${items.map(([label, ic]) => `<div class="nav ${label === active ? 'on' : ''}">${icon(ic)}<span>${label}</span></div>`).join('')}`).join('')}
      <div class="keys"><b>${icon('lock', 14)}No keys on this PC</b><span>Lemma reads public wallets and the chain. It never asks for your Axiom login.</span></div>
    </aside>`;
  const sol = (v, { sign = true } = {}) => `${sign ? (v >= 0 ? '+' : '−') : ''}${Math.abs(v).toFixed(2)} SOL`;
  const pnl = (v) => `<span class="${v >= 0 ? 'gain' : 'loss'}">${sol(v)}</span>`;
  const tok = (t, size = 22) => `<img class="tk" src="${t.img}" width="${size}" height="${size}" alt="">`;

  // Line chart for the equity curve. pts is [[gross, net]], p is how much of it to draw (0 to 1).
  function equity(pts, w, h, { p = 1, pad = 8 } = {}) {
    const n = Math.max(2, Math.round(pts.length * p));
    const all = pts.flat(), lo = Math.min(0, ...all), hi = Math.max(...all);
    const X = (i) => pad + (i / (pts.length - 1)) * (w - 2 * pad), Y = (v) => h - pad - ((v - lo) / (hi - lo)) * (h - 2 * pad);
    const line = (k) => pts.slice(0, n).map((q, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(q[k]).toFixed(1)}`).join(' ');
    const last = pts[n - 1];
    const area = `${line(1)} L${X(n - 1).toFixed(1)} ${Y(lo).toFixed(1)} L${X(0)} ${Y(lo).toFixed(1)} Z`;
    return { svg: `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="eqf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9f0a" stop-opacity=".22"/><stop offset="1" stop-color="#ff9f0a" stop-opacity="0"/></linearGradient></defs>
      <line x1="${pad}" x2="${w - pad}" y1="${Y(0)}" y2="${Y(0)}" stroke="rgb(255 255 255 / .12)" stroke-dasharray="3 4"/>
      <path d="${area}" fill="url(#eqf)"/><path d="${line(0)}" fill="none" stroke="#8e8e93" stroke-width="1.6" stroke-dasharray="4 4"/>
      <path d="${line(1)}" fill="none" stroke="#ff9f0a" stroke-width="2.4" stroke-linejoin="round"/>
      <circle cx="${X(n - 1)}" cy="${Y(last[1])}" r="4.5" fill="#ff9f0a"/></svg>`, gx: X(n - 1), gy: Y(last[0]), ny: Y(last[1]), last };
  }

  const cursorSVG = `<svg class="cursor" id="cursor" width="22" height="28" viewBox="0 0 22 28"><path d="M2 1.8 V22.6 L7.4 17.6 L11 26 L14.6 24.4 L11 16.2 H18.4 Z" fill="#000" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  const ease = (v) => { const t = Math.max(0, Math.min(1, v)); return 1 - (1 - t) ** 3; };
  const easeIO = (v) => { const t = Math.max(0, Math.min(1, v)); return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; };
  const span = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));

  g.UI = { icon, sidebar, sol, pnl, tok, equity, cursorSVG, ease, easeIO, span };
})(globalThis);
