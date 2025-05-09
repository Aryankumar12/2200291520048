import { Link } from "wouter";
import Navigation from "@/components/ui/Navigation";
import StockChart from "@/components/ui/StockChart";
import CorrelationHeatmap from "@/components/ui/CorrelationHeatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowUpCircle, CheckCircle, Clock, ArchiveRestore, Plus, ArrowRight, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const defaultStock = "NVDA";
  const defaultTimeFrame = 50;

  const { data: stockData } = useQuery({
    queryKey: [`/api/stocks/${defaultStock}?minutes=${defaultTimeFrame}`],
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <Navigation />
      
      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Expense Summary</CardTitle>
          </CardHeader>
          
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
      
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
         
        </Card>
      </div>

      {/* Stock Analysis Section */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Stock Analysis</CardTitle>
          <div className="flex space-x-2">
            <Link href="/stock-analysis">
              <Button variant="link">View Full Analysis</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <StockChart
            stockSymbol={defaultStock}
            timeInterval={defaultTimeFrame}
            data={stockData}
            height={300}
          />
        </CardContent>
      </Card>

      {/* Correlation Heatmap */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Stock Correlation Heatmap</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">Correlation Strength:</div>
            <div className="correlation-gradient w-32"></div>
            <div className="flex text-xs justify-between w-32">
              <span className="text-destructive">Negative</span>
              <span>Neutral</span>
              <span className="text-green-600">Positive</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CorrelationHeatmap />
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Recent Expenses</CardTitle>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Expense
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">Q2 Marketing Event</td>
                      <td className="py-3 px-4 text-sm">Events</td>
                      <td className="py-3 px-4 text-sm font-mono">$2,450.00</td>
                      <td className="py-3 px-4 text-sm">May 3, 2025</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Pending</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">Social Media Campaign</td>
                      <td className="py-3 px-4 text-sm">Advertising</td>
                      <td className="py-3 px-4 text-sm font-mono">$1,200.00</td>
                      <td className="py-3 px-4 text-sm">May 5, 2025</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">Design Software Subscription</td>
                      <td className="py-3 px-4 text-sm">Software</td>
                      <td className="py-3 px-4 text-sm font-mono">$850.00</td>
                      <td className="py-3 px-4 text-sm">May 7, 2025</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Pending</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>ArchiveRestore Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <ArchiveRestore className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Last ArchiveRestore</div>
                  <div className="text-sm text-muted-foreground">May 5, 2025, 2:30 AM</div>
                </div>
              </div>
              <div className="mt-2 mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Next Scheduled ArchiveRestore</span>
                  <span className="text-sm font-medium">May 12, 2025, 2:30 AM</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">ArchiveRestore Frequency</span>
                  <span className="text-sm font-medium">Weekly</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Data Retention</span>
                  <span className="text-sm font-medium">90 days</span>
                </div>
              </div>
              <Button className="w-full">Run Manual ArchiveRestore</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
