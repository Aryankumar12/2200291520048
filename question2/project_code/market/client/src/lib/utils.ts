import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StockPrice {
  price: number;
  lastUpdatedAt: string;
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Calculate price change and percentage from stock data
 */
export function calculatePriceChange(data: StockPrice[] | StockPrice): {
  amount: number;
  percentage: number;
  isPositive: boolean;
} | null {
  if (!data) return null;

  // Handle single stock price
  if (!Array.isArray(data)) {
    return {
      amount: 0,
      percentage: 0,
      isPositive: true
    };
  }

  // Handle array of stock prices
  if (data.length < 2) return null;

  const sortedData = [...data].sort((a, b) => 
    new Date(a.lastUpdatedAt).getTime() - new Date(b.lastUpdatedAt).getTime()
  );

  const firstPrice = sortedData[0].price;
  const lastPrice = sortedData[sortedData.length - 1].price;
  
  const priceChange = lastPrice - firstPrice;
  const percentageChange = (priceChange / firstPrice) * 100;

  return {
    amount: Math.abs(priceChange),
    percentage: Math.abs(percentageChange),
    isPositive: priceChange >= 0
  };
}

/**
 * Calculate average price from stock data
 */
export function calculateAveragePrice(data: StockPrice[] | StockPrice): number | null {
  if (!data) return null;

  // Handle single stock price
  if (!Array.isArray(data)) {
    return data.price;
  }

  // Handle array of stock prices
  if (data.length === 0) return null;

  const sum = data.reduce((total, item) => total + item.price, 0);
  return sum / data.length;
}
