import type { Project } from "../types";

export const cryptoTrader: Project = {
  slug: "crypto-trader",
  title: "Crypto Trading Bot",
  tagline: "A multi-indicator trading engine with live dashboard, backtesting and Telegram control.",
  kind: "hobby",
  year: 2025,
  featured: true,
  links: { repo: "https://github.com/RzayevTaleh01/crypto_trader" },
  facts: [
    { label: "Loop", value: "15 s" },
    { label: "Exchange", value: "Binance testnet" },
    { label: "Transport", value: "WebSocket" },
    { label: "Control", value: "Web + Telegram" },
  ],
  overview: [
    "An automated trading system that scans the market every 15 seconds, scores opportunities with several technical indicators, manages positions with explicit exit rules and streams every decision to a live dashboard.",
    "It runs against the Binance testnet by default - it is an engineering and research project, not financial advice.",
  ],
  architecture: {
    summary:
      "The strategy engine is isolated behind services: market access, portfolio accounting, notifications and persistence are each their own module, and the transport (WebSocket broadcast) is injected rather than imported.",
    layers: [
      {
        name: "Dashboard",
        nodes: [
          { name: "Portfolio", detail: "Holdings, charts, history" },
          { name: "Live activity", detail: "Streamed trades" },
          { name: "Bot settings", detail: "Risk, target, on/off" },
          { name: "Manual trading", detail: "Override the bot" },
        ],
      },
      {
        name: "Server",
        nodes: [
          { name: "REST API", detail: "Express" },
          { name: "WebSocket", detail: "Broadcast to clients" },
          { name: "Auth", detail: "Passport sessions" },
        ],
      },
      {
        name: "Trading services",
        nodes: [
          { name: "Strategy", detail: "Scoring & exits" },
          { name: "Binance", detail: "Market data & orders" },
          { name: "Portfolio", detail: "Balances & P/L" },
          { name: "Backtest", detail: "Replay & metrics" },
          { name: "Telegram", detail: "Commands & alerts" },
        ],
      },
      {
        name: "Data",
        nodes: [
          { name: "PostgreSQL", detail: "Drizzle ORM" },
          { name: "Tables", detail: "users · trades · portfolio · bot_settings · price_history" },
        ],
      },
    ],
  },
  components: [
    {
      name: "Strategy engine",
      role: "Decides what to buy and sell",
      points: [
        "Scores every coin with RSI, momentum, a MACD-style signal, Bollinger position, Fibonacci levels and market structure.",
        "Exits on profit targets, stop losses and overbought RSI; stops itself when the user's target balance is reached.",
      ],
    },
    {
      name: "Backtesting",
      role: "Validates a strategy before it trades",
      points: [
        "Replays generated historical prices through the same entry and exit logic.",
        "Reports win rate, number of trades and profit factor.",
      ],
    },
    {
      name: "Real-time layer",
      role: "Makes the bot observable",
      points: [
        "Every trade and balance change is broadcast over WebSocket to the dashboard.",
        "Telegram commands and alerts give control from a phone.",
      ],
    },
  ],
  flow: [
    { title: "Tick", detail: "Every 15 s the engine checks the bot is active for the user." },
    { title: "Guard", detail: "If total balance reached the target, sell everything and stop." },
    { title: "Score", detail: "Fetch market data and rank opportunities by the combined indicator score." },
    { title: "Act", detail: "Close positions that hit exit rules, open the best new ones within risk limits." },
    { title: "Report", detail: "Persist trades, broadcast over WebSocket and notify Telegram." },
  ],
  deepDives: [
    {
      title: "Measuring a strategy",
      body: [
        "Backtests use the same take-profit (+8%) and stop-loss (−5%) rules as live trading. The key metric is the profit factor - gross profit divided by gross loss - where anything above 1 means the strategy made more than it lost.",
      ],
      formula: "\\text{Profit factor} = \\frac{\\sum \\text{winning trades}}{\\left|\\sum \\text{losing trades}\\right|}",
    },
  ],
  decisions: [
    { title: "Testnet by default", detail: "The Binance client starts in testnet mode, so the full pipeline can run without real funds." },
    { title: "Injected broadcast", detail: "The strategy receives a broadcast function instead of importing the WebSocket server, keeping it testable in isolation." },
    { title: "One schema for all state", detail: "Trades, holdings, settings and price history share a typed Drizzle schema with Zod validation." },
  ],
  stack: [
    { group: "Frontend", items: ["React", "TypeScript", "Vite", "Recharts", "Chart.js", "shadcn/ui"] },
    { group: "Backend", items: ["Node.js", "Express", "ws", "Passport", "binance-api-node", "node-telegram-bot-api"] },
    { group: "Data", items: ["PostgreSQL", "Drizzle ORM", "Zod"] },
  ],
};
