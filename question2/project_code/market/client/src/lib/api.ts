import { apiRequest } from "./queryClient";

// Base URL for the proxy API
const API_BASE_URL = 'http://20.244.56.144/evaluation-service';

// Interfaces
export interface StockPrice {
  price: number;
  lastUpdatedAt: string;
}

export interface StockListResponse {
  stocks: { [key: string]: string };
}

// Function to get all available stocks
export async function getStocks() {
  try {
    const response = await apiRequest('GET', '/api/stocks');
    return await response.json() as StockListResponse;
  } catch (error) {
    console.error('Error fetching stocks list:', error);
    throw error;
  }
}

// Function to get the current price of a specific stock
export async function getStockPrice(ticker: string) {
  try {
    const response = await apiRequest('GET', `/api/stocks/${ticker}`);
    return await response.json() as StockPrice;
  } catch (error) {
    console.error(`Error fetching current price for ${ticker}:`, error);
    throw error;
  }
}

// Function to get the price history of a stock for a specific time interval
export async function getStockHistory(ticker: string, minutes: number) {
  try {
    const response = await apiRequest('GET', `/api/stocks/${ticker}?minutes=${minutes}`);
    return await response.json() as StockPrice[];
  } catch (error) {
    console.error(`Error fetching price history for ${ticker}:`, error);
    throw error;
  }
}

// Function to get correlation data for multiple stocks
export async function getCorrelationData(tickers: string[], minutes: number = 60) {
  try {
    const response = await apiRequest('GET', '/api/correlations');
    return await response.json();
  } catch (error) {
    console.error('Error fetching correlation data:', error);
    throw error;
  }
}

export default {
  getStocks,
  getStockPrice,
  getStockHistory,
  getCorrelationData
};
