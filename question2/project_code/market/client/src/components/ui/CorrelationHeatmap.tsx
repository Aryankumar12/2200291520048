import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { calculateCorrelations } from "@/lib/calculations";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StockPrice {
  price: number;
  lastUpdatedAt: string;
}

interface CorrelationData {
  [key: string]: {
    [key: string]: number;
  };
}

interface CorrelationHeatmapProps {
  selectedStock?: string;
}

const CorrelationHeatmap = ({ selectedStock }: CorrelationHeatmapProps) => {
  const [correlationData, setCorrelationData] = useState<CorrelationData>({});
  const [stockSymbols, setStockSymbols] = useState<string[]>([]);
  const [statistics, setStatistics] = useState<{ [key: string]: { avg: number; stdDev: number } }>({});

  // Get the list of stocks
  const { data: stocksList } = useQuery({
    queryKey: ['/api/stocks'],
  });

  // Get historical data for the top 5 stocks to create the correlation heatmap
  const { data: stocksData } = useQuery({
    queryKey: ['/api/correlations'],
  });

  useEffect(() => {
    if (stocksList && stocksData) {
      // Extract top 5 stocks (or all if less than 5)
      const symbols: string[] = Object.values(stocksList.stocks).slice(0, 5) as string[];
      setStockSymbols(symbols);

      // Calculate correlations between these stocks
      const correlations = calculateCorrelations(stocksData, symbols);
      setCorrelationData(correlations.correlations);
      setStatistics(correlations.statistics);
    }
  }, [stocksList, stocksData]);

  const getColorForCorrelation = (value: number) => {
    if (value === 1) return "bg-green-600 text-white";
    if (value >= 0.7) return "bg-green-200";
    if (value >= 0.3) return "bg-green-100";
    if (value >= 0) return "bg-yellow-100";
    if (value >= -0.3) return "bg-orange-100";
    return "bg-red-100";
  };

  if (!stocksList || !stocksData || stockSymbols.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
        <p className="text-muted-foreground">Loading correlation data...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 text-left text-sm font-medium text-muted-foreground"></th>
              {stockSymbols.map((symbol) => (
                <th key={symbol} className="p-2 text-left text-sm font-medium text-muted-foreground">
                  {symbol}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stockSymbols.map((rowSymbol) => (
              <tr key={rowSymbol}>
                <td className="p-2 text-sm font-medium">{rowSymbol}</td>
                {stockSymbols.map((colSymbol) => {
                  const correlation = correlationData[rowSymbol]?.[colSymbol] || 0;
                  const statInfo = statistics[rowSymbol];
                  
                  return (
                    <td key={`${rowSymbol}-${colSymbol}`} className="p-0">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`h-10 w-full ${getColorForCorrelation(correlation)} flex items-center justify-center text-xs`}>
                              {correlation.toFixed(2)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <div className="text-sm">
                              <p className="font-medium">{rowSymbol} to {colSymbol}</p>
                              <p>Correlation: {correlation.toFixed(2)}</p>
                              {statInfo && (
                                <>
                                  <p>Avg. Price: ${statInfo.avg.toFixed(2)}</p>
                                  <p>Std. Deviation: ${statInfo.stdDev.toFixed(2)}</p>
                                </>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;
