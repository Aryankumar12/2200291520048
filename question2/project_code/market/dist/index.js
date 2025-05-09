// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import fetch from "node-fetch";
var STOCK_API_BASE_URL = "http://20.244.56.144/evaluation-service";
var STOCK_API_TOKEN = process.env.STOCK_API_TOKEN;
var getAuthHeaders = () => {
  return {
    "Authorization": `Bearer ${STOCK_API_TOKEN}`,
    "Content-Type": "application/json"
  };
};
var SAMPLE_STOCKS = {
  "stocks": {
    "Advanced Micro Devices, Inc.": "AMD",
    "Alphabet Inc. Class A": "GOOGL",
    "Alphabet Inc. Class C": "GOOG",
    "Amazon.com, Inc.": "AMZN",
    "Amgen Inc.": "AMGN",
    "Apple Inc.": "AAPL",
    "Berkshire Hathaway Inc.": "BRKB",
    "Booking Holdings Inc.": "BKNG",
    "Broadcom Inc.": "AVGO",
    "CSX Corporation": "CSX",
    "Eli Lilly and Company": "LLY",
    "Marriott International, Inc.": "MAR",
    "Marvell Technology, Inc.": "MRVL",
    "Meta Platforms, Inc.": "META",
    "Microsoft Corporation": "MSFT",
    "Nvidia Corporation": "NVDA",
    "PayPal Holdings, Inc.": "PYPL",
    "TSMC": "2330TW",
    "Tesla, Inc.": "TSLA",
    "Visa Inc.": "V"
  }
};
function generateStockPrice() {
  return {
    price: Math.random() * 1e3,
    lastUpdatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function generatePriceHistory(minutes) {
  const priceHistory = [];
  const now = /* @__PURE__ */ new Date();
  for (let i = 0; i < Math.min(10, minutes); i++) {
    const time = new Date(now);
    time.setMinutes(now.getMinutes() - i * 5);
    priceHistory.push({
      price: Math.random() * 1e3,
      lastUpdatedAt: time.toISOString()
    });
  }
  return priceHistory;
}
async function registerRoutes(app2) {
  app2.get("/api/stocks", async (req, res) => {
    try {
      console.log("Fetching stocks with token:", STOCK_API_TOKEN ? "Token available" : "No token");
      try {
        const response = await fetch(`${STOCK_API_BASE_URL}/stocks`, {
          headers: getAuthHeaders()
        });
        if (!response.ok) {
          throw new Error(`Error fetching stocks: ${response.statusText} (${response.status})`);
        }
        const data = await response.json();
        res.json(data);
      } catch (apiError) {
        console.log("Using sample stock data as fallback");
        res.json(SAMPLE_STOCKS);
      }
    } catch (error) {
      console.error("Error providing stocks:", error);
      res.status(500).json({ message: "Failed to provide stock data" });
    }
  });
  app2.get("/api/stocks/:ticker", async (req, res) => {
    try {
      const { ticker } = req.params;
      const minutes = req.query.minutes;
      let apiUrl = `${STOCK_API_BASE_URL}/stocks/${ticker}`;
      if (minutes) {
        apiUrl += `?minutes=${minutes}`;
      }
      console.log(`Fetching stock data for ${ticker} from ${apiUrl}`);
      try {
        const response = await fetch(apiUrl, {
          headers: getAuthHeaders()
        });
        if (!response.ok) {
          throw new Error(`Error fetching stock data: ${response.statusText} (${response.status})`);
        }
        const data = await response.json();
        res.json(data);
      } catch (apiError) {
        console.log(`Using simulated data for ${ticker} as fallback`);
        if (minutes) {
          res.json(generatePriceHistory(Number(minutes)));
        } else {
          res.json({ stock: generateStockPrice() });
        }
      }
    } catch (error) {
      console.error("Error providing stock data:", error);
      res.status(500).json({ message: "Failed to provide stock data" });
    }
  });
  app2.get("/api/correlations", async (req, res) => {
    try {
      try {
        const stocksResponse = await fetch(`${STOCK_API_BASE_URL}/stocks`, {
          headers: getAuthHeaders()
        });
        if (!stocksResponse.ok) {
          throw new Error(`Error fetching stocks: ${stocksResponse.statusText} (${stocksResponse.status})`);
        }
        const stocksData = await stocksResponse.json();
        const stockSymbols = Object.values(stocksData.stocks).slice(0, 5);
        const minutes = 60;
        const stockDataPromises = stockSymbols.map(async (symbol) => {
          const response = await fetch(`${STOCK_API_BASE_URL}/stocks/${symbol}?minutes=${minutes}`, {
            headers: getAuthHeaders()
          });
          if (!response.ok) {
            throw new Error(`Error fetching data for ${symbol}: ${response.statusText} (${response.status})`);
          }
          return { symbol, data: await response.json() };
        });
        const results = await Promise.all(stockDataPromises);
        const correlationData = {};
        results.forEach((result) => {
          correlationData[result.symbol] = result.data;
        });
        res.json(correlationData);
      } catch (apiError) {
        console.log("Using simulated correlation data as fallback");
        const stockSymbols = Object.values(SAMPLE_STOCKS.stocks).slice(0, 5);
        const correlationData = {};
        stockSymbols.forEach((symbol) => {
          correlationData[symbol] = generatePriceHistory(60);
        });
        res.json(correlationData);
      }
    } catch (error) {
      console.error("Error providing correlation data:", error);
      res.status(500).json({ message: "Failed to provide correlation data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import dotenv from "dotenv";
dotenv.config();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
