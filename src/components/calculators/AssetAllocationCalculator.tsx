import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

type RiskProfile = "conservative" | "moderate" | "aggressive";

const AssetAllocationCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("moderate");

  const calculateAllocation = () => {
    // Base equity allocation: 100 - Age
    const baseEquity = 100 - currentAge;

    // Adjust based on risk profile
    let equityAdjustment = 0;
    switch (riskProfile) {
      case "conservative":
        equityAdjustment = -15;
        break;
      case "moderate":
        equityAdjustment = 0;
        break;
      case "aggressive":
        equityAdjustment = 15;
        break;
    }

    const equity = Math.max(10, Math.min(90, baseEquity + equityAdjustment));
    const debt = 100 - equity;

    return { equity, debt };
  };

  const allocation = calculateAllocation();

  const chartData = [
    { name: "Equity", value: allocation.equity },
    { name: "Debt", value: allocation.debt },
  ];

  const COLORS = ["hsl(38, 100%, 50%)", "hsl(218, 55%, 28%)"];

  const getEquityBreakdown = () => {
    const equity = allocation.equity;
    if (riskProfile === "conservative") {
      return {
        largeCap: Math.round(equity * 0.7),
        midCap: Math.round(equity * 0.2),
        smallCap: Math.round(equity * 0.1),
      };
    } else if (riskProfile === "moderate") {
      return {
        largeCap: Math.round(equity * 0.5),
        midCap: Math.round(equity * 0.3),
        smallCap: Math.round(equity * 0.2),
      };
    } else {
      return {
        largeCap: Math.round(equity * 0.3),
        midCap: Math.round(equity * 0.4),
        smallCap: Math.round(equity * 0.3),
      };
    }
  };

  const getDebtBreakdown = () => {
    const debt = allocation.debt;
    return {
      governmentBonds: Math.round(debt * 0.4),
      corporateBonds: Math.round(debt * 0.35),
      fixedDeposits: Math.round(debt * 0.25),
    };
  };

  const equityBreakdown = getEquityBreakdown();
  const debtBreakdown = getDebtBreakdown();

  const getRiskDescription = () => {
    switch (riskProfile) {
      case "conservative":
        return "Lower risk tolerance, focused on capital preservation with stable returns.";
      case "moderate":
        return "Balanced approach with a mix of growth and stability.";
      case "aggressive":
        return "Higher risk tolerance, focused on capital appreciation with potential for higher volatility.";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Inputs */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Your Current Age</Label>
          <Input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[currentAge]}
            onValueChange={([value]) => setCurrentAge(value)}
            min={18}
            max={70}
            step={1}
            className="w-full"
            aria-label="Current age slider"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Risk Profile</Label>
          <Select value={riskProfile} onValueChange={(value: RiskProfile) => setRiskProfile(value)}>
            <SelectTrigger className="h-11 bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="conservative">Conservative</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="aggressive">Aggressive</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">{getRiskDescription()}</p>
        </div>
      </div>

      {/* Right Column - Results & Chart */}
      <div className="space-y-6">
        {/* Allocation Summary */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent"></span>
              Equity Allocation
            </span>
            <span className="font-bold text-accent text-lg">{allocation.equity}%</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              Debt Allocation
            </span>
            <span className="font-bold text-primary text-lg">{allocation.debt}%</span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
            <h5 className="font-semibold text-accent text-sm mb-3">Equity Breakdown</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Large Cap</span>
                <span className="font-medium">{equityBreakdown.largeCap}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mid Cap</span>
                <span className="font-medium">{equityBreakdown.midCap}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Small Cap</span>
                <span className="font-medium">{equityBreakdown.smallCap}%</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
            <h5 className="font-semibold text-primary text-sm mb-3">Debt Breakdown</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Govt. Bonds</span>
                <span className="font-medium">{debtBreakdown.governmentBonds}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Corp. Bonds</span>
                <span className="font-medium">{debtBreakdown.corporateBonds}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">FDs</span>
                <span className="font-medium">{debtBreakdown.fixedDeposits}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-muted/20 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value}%`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground text-center mt-2">
            <strong>Rule of Thumb:</strong> 100 - Your Age = Equity Allocation
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationCalculator;
