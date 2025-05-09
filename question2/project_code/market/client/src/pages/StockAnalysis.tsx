import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import StockSelector from "@/components/ui/StockSelector";
import TimeIntervalSelector from "@/components/ui/TimeIntervalSelector";
import StockChart from "@/components/ui/StockChart";
import CorrelationHeatmap from "@/components/ui/CorrelationHeatmap";
import { format } from "date-fns";
import { formatCurrency, calculatePriceChange, calculateAveragePrice } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

const StockAnalysis = () => {
  const [selectedStock, setSelectedStock] = useState<string>("NVDA");
  const [timeInterval, setTimeInterval] = useState<number>(50);

  const { data: stockData, isLoading } = useQuery({
    queryKey: [`/api/stocks/${selectedStock}?minutes=${timeInterval}`],
  });

  const { data: stocksList } = useQuery({
    queryKey: ['/api/stocks'],
  });

  const handleStockChange = (stock: string) => {
    setSelectedStock(stock);
  };

  const handleTimeIntervalChange = (interval: number) => {
    setTimeInterval(interval);
  };

  // Calculate price change and percentage
  const priceChange = stockData ? calculatePriceChange(stockData) : null;
  const averagePrice = stockData ? calculateAveragePrice(stockData) : null;
  const currentPrice = stockData && Array.isArray(stockData) ? stockData[stockData.length - 1]?.price : (stockData?.price || 0);

  return (
    <div className="container mx-auto px-4 py-6">
      
      <Card className="mb-6 shadow-lg border-t border-purple-200 bg-gradient-to-b from-white to-purple-50 rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl text-primary font-bold">Price Trends</CardTitle>
          <div className="flex space-x-2">
            <StockSelector 
              selectedStock={selectedStock} 
              onStockChange={handleStockChange}
              stocksList={stocksList?.stocks}
            />
            <TimeIntervalSelector 
              selectedInterval={timeInterval} 
              onIntervalChange={handleTimeIntervalChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-3xl font-bold text-secondary">
                {formatCurrency(currentPrice)}
              </div>
              {priceChange && (
                <div className={`flex items-center font-medium ${priceChange.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {priceChange.isPositive ? <ArrowUp className="h-5 w-5 mr-1" /> : <ArrowDown className="h-5 w-5 mr-1" />}
                  <span>{`${formatCurrency(priceChange.amount)} (${priceChange.percentage.toFixed(2)}%)`}</span>
                </div>
              )}
            </div>
            {averagePrice && (
              <div className="bg-purple-100 px-4 py-2 rounded-full text-sm font-semibold text-primary shadow-sm">
                Avg. Price: {formatCurrency(averagePrice)}
              </div>
            )}
          </div>
          
          <StockChart 
            stockSymbol={selectedStock}
            timeInterval={timeInterval}
            data={stockData}
            height={400}
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg border-t border-purple-200 bg-gradient-to-b from-white to-purple-50 rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl text-primary font-bold">Market Correlation Analysis</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium text-secondary">Correlation Strength:</div>
            <div className="correlation-gradient w-32 rounded-full shadow-sm"></div>
            <div className="flex text-xs justify-between w-32">
              <span className="text-rose-600 font-medium">Negative</span>
              <span className="font-medium">Neutral</span>
              <span className="text-emerald-600 font-medium">Positive</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CorrelationHeatmap selectedStock={selectedStock} />
          <div className="mt-4 text-sm text-secondary bg-purple-50 p-3 rounded-lg">
            <p className="font-medium">Hover over cells to see detailed statistics. Strong positive correlations (closer to 1.0) appear in purple, while negative correlations appear in red.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockAnalysis;
