interface StockPrice {
  price: number;
  lastUpdatedAt: string;
}

interface StockData {
  [key: string]: StockPrice[];
}

interface Statistics {
  [key: string]: {
    avg: number;
    stdDev: number;
  };
}

/**
 * Calculate Pearson correlation coefficient between two arrays
 */
export function calculateCorrelation(x: number[], y: number[]): number {
  // Check if arrays are of the same length and have enough values
  if (x.length !== y.length || x.length < 2) {
    return 0;
  }

  // Calculate means
  const n = x.length;
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;

  // Calculate the numerator and denominator
  let numerator = 0;
  let xVariance = 0;
  let yVariance = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    numerator += xDiff * yDiff;
    xVariance += xDiff * xDiff;
    yVariance += yDiff * yDiff;
  }

  // Avoid division by zero
  if (xVariance === 0 || yVariance === 0) {
    return 0;
  }

  return numerator / Math.sqrt(xVariance * yVariance);
}

/**
 * Calculate standard deviation of an array
 */
export function calculateStandardDeviation(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;

  const mean = values.reduce((sum, val) => sum + val, 0) / n;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  return Math.sqrt(variance);
}

/**
 * Calculate average of an array
 */
export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate correlations between multiple stocks
 */
export function calculateCorrelations(
  stocksData: StockData,
  stockSymbols: string[]
): {
  correlations: { [key: string]: { [key: string]: number } },
  statistics: Statistics
} {
  const correlations: { [key: string]: { [key: string]: number } } = {};
  const statistics: Statistics = {};

  // Extract price data for each stock
  const pricesByStock: { [key: string]: number[] } = {};
  stockSymbols.forEach(symbol => {
    if (stocksData[symbol]) {
      pricesByStock[symbol] = stocksData[symbol].map(item => item.price);
      
      // Calculate stats
      const prices = pricesByStock[symbol];
      statistics[symbol] = {
        avg: calculateAverage(prices),
        stdDev: calculateStandardDeviation(prices)
      };
    }
  });

  // Calculate correlation matrix
  stockSymbols.forEach(symbolA => {
    correlations[symbolA] = {};
    stockSymbols.forEach(symbolB => {
      if (pricesByStock[symbolA] && pricesByStock[symbolB]) {
        // Same stock always has perfect correlation
        if (symbolA === symbolB) {
          correlations[symbolA][symbolB] = 1;
        } else {
          // Calculate correlation between the two stocks
          correlations[symbolA][symbolB] = calculateCorrelation(
            pricesByStock[symbolA],
            pricesByStock[symbolB]
          );
        }
      } else {
        correlations[symbolA][symbolB] = 0;
      }
    });
  });

  return { correlations, statistics };
}
