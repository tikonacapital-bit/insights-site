import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import DonutChart from "./DonutChart";
import { formatCurrency } from "./types";

const CrorepatiCalculator = () => {
  const [targetWealth, setTargetWealth] = useState(5); // In Crores
  const [currentAge, setCurrentAge] = useState(25);
  const [targetAge, setTargetAge] = useState(40);
  const [currentSavings, setCurrentSavings] = useState(1000000);
  const [inflationRate, setInflationRate] = useState(6);
  const [expectedReturn, setExpectedReturn] = useState(12);

  const calculateResults = () => {
    const years = targetAge - currentAge;
    const targetAmount = targetWealth * 10000000; // Convert to actual amount
    
    // Calculate inflation-adjusted target
    const inflationAdjustedTarget = targetAmount * Math.pow(1 + inflationRate / 100, years);
    
    // Growth of current savings
    const growthOfSavings = currentSavings * Math.pow(1 + expectedReturn / 100, years);
    
    // Remaining amount needed
    const remainingAmount = Math.max(0, inflationAdjustedTarget - growthOfSavings);
    
    // Calculate required monthly SIP
    const monthlyRate = expectedReturn / 100 / 12;
    const months = years * 12;
    
    let monthlySIP = 0;
    if (remainingAmount > 0 && months > 0) {
      monthlySIP = remainingAmount / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    }
    
    const totalInvested = monthlySIP * months;
    const finalWealth = growthOfSavings + (monthlySIP * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)));
    
    return {
      monthlySIP,
      totalInvested,
      targetedWealth: inflationAdjustedTarget,
      growthOfSavings,
      finalWealth,
    };
  };

  const result = calculateResults();
  const years = targetAge - currentAge;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Inputs */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Desired Wealth (₹ Crore)</Label>
          <Input
            type="number"
            value={targetWealth}
            onChange={(e) => setTargetWealth(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[targetWealth]}
            onValueChange={([value]) => setTargetWealth(value)}
            min={1}
            max={50}
            step={1}
            className="w-full"
            aria-label="Desired wealth slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Current Age</Label>
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
            max={60}
            step={1}
            className="w-full"
            aria-label="Current age slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Target Age (When to become Crorepati)</Label>
          <Input
            type="number"
            value={targetAge}
            onChange={(e) => setTargetAge(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[targetAge]}
            onValueChange={([value]) => setTargetAge(value)}
            min={currentAge + 1}
            max={70}
            step={1}
            className="w-full"
            aria-label="Target age slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Current Savings (₹)</Label>
          <Input
            type="number"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[currentSavings]}
            onValueChange={([value]) => setCurrentSavings(value)}
            min={0}
            max={50000000}
            step={100000}
            className="w-full"
            aria-label="Current savings slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Expected Inflation Rate (%)</Label>
          <Input
            type="number"
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[inflationRate]}
            onValueChange={([value]) => setInflationRate(value)}
            min={1}
            max={15}
            step={0.5}
            className="w-full"
            aria-label="Inflation rate slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Expected Return Rate (%)</Label>
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
            aria-label="Expected return rate slider"
          />
        </div>
      </div>

      {/* Right Column - Results & Chart */}
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Monthly SIP Required</span>
            <span className="font-bold text-accent text-lg">{formatCurrency(result.monthlySIP)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Total Amount Invested</span>
            <span className="font-bold text-foreground text-lg">{formatCurrency(result.totalInvested)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Targeted Wealth Amount</span>
            <span className="font-bold text-foreground text-lg">{formatCurrency(result.targetedWealth)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Growth of Current Savings</span>
            <span className="font-bold text-foreground text-lg">{formatCurrency(result.growthOfSavings)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-foreground font-semibold">Final Wealth Amount</span>
            <span className="font-bold text-primary text-xl">{formatCurrency(result.finalWealth)}</span>
          </div>
        </div>

        {/* Chart */}
        <div className="flex flex-col items-center justify-center bg-muted/20 rounded-xl p-4">
          <DonutChart
            invested={result.totalInvested}
            returns={result.finalWealth - result.totalInvested - currentSavings}
            investedLabel="Amount Invested"
            returnsLabel="Estimated Returns"
          />
        </div>
      </div>
    </div>
  );
};

export default CrorepatiCalculator;
