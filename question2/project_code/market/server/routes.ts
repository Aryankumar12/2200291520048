import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";

const STOCK_API_BASE_URL = "http://20.244.56.144/evaluation-service";

const STOCK_API_TOKEN = process.env.STOCK_API_TOKEN;

const getAuthHeaders = () => {
  return {
    'Authorization': `Bearer ${STOCK_API_TOKEN}`,
    'Content-Type': 'application/json'
  };
};

const SAMPLE_STOCKS = {



    // these are the avialable 
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
    price: Math.random() * 1000,
    lastUpdatedAt: new Date().toISOString()
  };
}

function generatePriceHistory(minutes: number) {
  const priceHistory = [];
  const now = new Date();
  
  for (let i = 0; i < Math.min(10, minutes); i++) {
    const time = new Date(now);
    time.setMinutes(now.getMinutes() - i * 5);
    
    priceHistory.push({
      price: Math.random() * 1000,
      lastUpdatedAt: time.toISOString()
    });
  }
  
  return priceHistory;
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/stocks", async (req, res) => {
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
        // Use fallback data if API is unavailable
        res.json(SAMPLE_STOCKS);
      }
    } catch (error) {
      console.error("Error providing stocks:", error);
      res.status(500).json({ message: "Failed to provide stock data" });
    }
  });

  app.get("/api/stocks/:ticker", async (req, res) => {
    try {
      const { ticker } = req.params;
      const minutes = req.query.minutes;
      
      let apiUrl = `${STOCK_API_BASE_URL}/stocks/${ticker}`;
      
      // Add minutes parameter if provided
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
        // Return simulated data if API is unavailable
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

  app.get("/api/correlations", async (req, res) => {
    try {
      try {
        const stocksResponse = await fetch(`${STOCK_API_BASE_URL}/stocks`, {
          headers: getAuthHeaders()
        });
        
        if (!stocksResponse.ok) {
          throw new Error(`Error fetching stocks: ${stocksResponse.statusText} (${stocksResponse.status})`);
        }
        
        const stocksData = await stocksResponse.json() as { stocks: Record<string, string> };
        const stockSymbols = Object.values(stocksData.stocks).slice(0, 5) as string[]; // Get top 5 stocks
        
        const minutes = 60; // Default time interval for correlation
        const stockDataPromises = stockSymbols.map(async (symbol: string) => {
          const response = await fetch(`${STOCK_API_BASE_URL}/stocks/${symbol}?minutes=${minutes}`, {
            headers: getAuthHeaders()
          });
          
          if (!response.ok) {
            throw new Error(`Error fetching data for ${symbol}: ${response.statusText} (${response.status})`);
          }
          
          return { symbol, data: await response.json() };
        });
        
        const results = await Promise.all(stockDataPromises);
        
        const correlationData: Record<string, any> = {};
        results.forEach(result => {
          correlationData[result.symbol] = result.data;
        });
        
        res.json(correlationData);





      } catch (apiError) {
        console.log("Using simulated correlation data as fallback");
        
        const stockSymbols = Object.values(SAMPLE_STOCKS.stocks).slice(0, 5) as string[];
        const correlationData: Record<string, any> = {};
        
        stockSymbols.forEach(symbol => {
          correlationData[symbol] = generatePriceHistory(60);
        });
        
        res.json(correlationData);
      }
    } catch (error) {
      console.error("Error providing correlation data:", error);
      res.status(500).json({ message: "Failed to provide correlation data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
