import { LineChart, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary to-purple-700 text-white shadow-lg z-10 rounded-b-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1.5 rounded-full">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">StockPulse Analytics</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-purple-800 bg-opacity-40 rounded-full px-4 py-1.5">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Real-time Analysis</span>
            </div>
            <Button variant="secondary" size="sm" className="flex items-center gap-2 bg-white text-primary hover:bg-purple-100">
              <BarChart3 className="h-4 w-4" />
              <span className="font-semibold">Market Insights</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
