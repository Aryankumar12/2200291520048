import { ChevronDown } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface StockSelectorProps {
  selectedStock: string;
  onStockChange: (value: string) => void;
  stocksList?: {[key: string]: string};
}

const StockSelector = ({ selectedStock, onStockChange, stocksList }: StockSelectorProps) => {
  // If no stocks list is provided, use a default list of common stocks
  const stocks = stocksList || {
    "Nvidia Corporation": "NVDA",
    "Apple Inc.": "AAPL",
    "Microsoft Corporation": "MSFT",
    "Alphabet Inc. Class A": "GOOGL",
    "Amazon.com, Inc.": "AMZN"
  };

  return (
    <Select
      value={selectedStock}
      onValueChange={onStockChange}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select Stock" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(stocks).map(([name, symbol]) => (
          <SelectItem key={symbol} value={symbol}>
            {name} ({symbol})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StockSelector;
