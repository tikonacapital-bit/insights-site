import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "./types";

const StepUpSIPCalculator = () => {
  const [monthlyAmount, setMonthlyAmount] = useState(10000);
  const [stepUpPercentage, setStepUpPercentage] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [tenure, setTenure] = useState(15);

  const calculateStepUpSIP = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    let totalInvested = 0;
    let totalValue = 0;
    let currentSIP = monthlyAmount;
    
    for (let year = 1; year <= tenure; year++) {
      // Calculate value for each year with current SIP
      for (let month = 1; month <= 12; month++) {
        const monthsRemaining = (tenure - year) * 12 + (12 - month) + 1;
        totalInvested += currentSIP;
        totalValue += currentSIP * Math.pow(1 + monthlyRate, monthsRemaining);
      }
      // Step up at end of year
      currentSIP = currentSIP * (1 + stepUpPercentage / 100);
    }
    
    return {
      totalInvested,
      totalValue,
      estimatedReturns: totalValue - totalInvested,
    };
  };

  // Calculate regular SIP for comparison
  const calculateRegularSIP = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const months = tenure * 12;
    const totalInvested = monthlyAmount * months;
    const totalValue = monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    return { totalInvested, totalValue };
  };

  const stepUpResult = calculateStepUpSIP();
  const regularResult = calculateRegularSIP();

  const generateChartData = () => {
    const data = [];
    const monthlyRate = expectedReturn / 100 / 12;
    let currentSIP = monthlyAmount;
    let cumulativeInvested = 0;
    let cumulativeValue = 0;
    
    for (let year = 1; year <= tenure; year++) {
      let yearlyInvested = 0;
      
      for (let month = 1; month <= 12; month++) {
        yearlyInvested += currentSIP;
        cumulativeInvested += currentSIP;
      }
      
      // Recalculate total value at end of year
      cumulativeValue = 0;
      let tempSIP = monthlyAmount;
      for (let y = 1; y <= year; y++) {
        for (let m = 1; m <= 12; m++) {
          const monthsFromNow = (year - y) * 12 + (12 - m) + 1;
          cumulativeValue += tempSIP * Math.pow(1 + monthlyRate, monthsFromNow);
        }
        tempSIP = tempSIP * (1 + stepUpPercentage / 100);
      }
      
      data.push({
        year: `Year ${year}`,
        invested: cumulativeInvested,
        returns: cumulativeValue - cumulativeInvested,
      });
      
      currentSIP = currentSIP * (1 + stepUpPercentage / 100);
    }
    
    return data;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Inputs */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Initial Monthly Investment (₹)</Label>
          <Input
            type="number"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[monthlyAmount]}
            onValueChange={([value]) => setMonthlyAmount(value)}
            min={500}
            max={100000}
            step={500}
            className="w-full"
            aria-label="Initial monthly investment slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Annual Step-up Percentage (%)</Label>
          <Input
            type="number"
            value={stepUpPercentage}
            onChange={(e) => setStepUpPercentage(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[stepUpPercentage]}
            onValueChange={([value]) => setStepUpPercentage(value)}
            min={1}
            max={50}
            step={1}
            className="w-full"
            aria-label="Annual step-up percentage slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Expected Return (%)</Label>
          <Input
            type="number"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[expectedReturn]}
            onValueChange={([value]) => setExpectedReturn(value)}
            min={1}
            max={25}
            step={0.5}
            className="w-full"
            aria-label="Expected return slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Time Period (Years)</Label>
          <Input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[tenure]}
            onValueChange={([value]) => setTenure(value)}
            min={5}
            max={40}
            step={1}
            className="w-full"
            aria-label="Time period slider"
          />
        </div>
      </div>

      {/* Right Column - Results & Chart */}
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Total Invested</span>
            <span className="font-bold text-foreground text-lg">{formatCurrency(stepUpResult.totalInvested)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Estimated Returns</span>
            <span className="font-bold text-accent text-lg">{formatCurrency(stepUpResult.estimatedReturns)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-foreground font-semibold">Total Value</span>
            <span className="font-bold text-primary text-xl">{formatCurrency(stepUpResult.totalValue)}</span>
          </div>
        </div>

        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
          <p className="text-sm text-foreground mb-2"><strong>Comparison with Regular SIP:</strong></p>
          <div className="text-sm space-y-1">
            <p>Regular SIP Value: {formatCurrency(regularResult.totalValue)}</p>
            <p>Step-up SIP Value: {formatCurrency(stepUpResult.totalValue)}</p>
            <p className="text-accent font-semibold">
              Extra Wealth: {formatCurrency(stepUpResult.totalValue - regularResult.totalValue)}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-muted/20 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={generateChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="invested" stackId="a" fill="hsl(var(--primary))" name="Invested" radius={[2, 2, 0, 0]} />
              <Bar dataKey="returns" stackId="a" fill="hsl(var(--accent))" name="Returns" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StepUpSIPCalculator;
