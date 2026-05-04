import { useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "./types";
import { Switch } from "@/components/ui/switch";

// Chart data item interface
interface ChartDataItem {
  year: string;
  invested: number;
  mfReturns: number;
  fdInvested?: number;
  fdReturns?: number;
  futureCost?: number;
}

const SIPLumpsumCalculator = () => {
  const [investmentType, setInvestmentType] = useState<"sip" | "lumpsum">("sip");
  const [amount, setAmount] = useState(5000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);
  
  // Comparison toggles
  const [compareWithFD, setCompareWithFD] = useState(false);
  const [compareWithInflation, setCompareWithInflation] = useState(false);
  const [fdRate, setFdRate] = useState(7);
  const [inflationRate, setInflationRate] = useState(6);

  const calculateResult = () => {
    if (investmentType === "sip") {
      const monthlyRate = returnRate / 100 / 12;
      const months = years * 12;
      const futureValue = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate));
      const invested = amount * months;
      const returns = futureValue - invested;
      return { futureValue, invested, returns };
    } else {
      const rate = returnRate / 100;
      const futureValue = amount * Math.pow(1 + rate, years);
      const invested = amount;
      const returns = futureValue - invested;
      return { futureValue, invested, returns };
    }
  };

  // FD calculation using same annuity formula for SIP (like RD), annual compounding for lumpsum
  const calculateFDValue = useCallback((year: number, totalInvested: number) => {
    if (investmentType === "sip") {
      // SIP treated as Recurring Deposit - FV of Annuity formula
      // FV = M × [(1 + i)^n - 1] / i × (1 + i)
      const monthlyRate = fdRate / 100 / 12;
      const months = year * 12;
      const fdValue = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      return { invested: totalInvested, returns: Math.max(0, fdValue - totalInvested) };
    } else {
      // Lumpsum FD - annual compounding: P × (1 + r)^t
      const annualRate = fdRate / 100;
      const fdValue = amount * Math.pow(1 + annualRate, year);
      return { invested: amount, returns: Math.max(0, fdValue - amount) };
    }
  }, [investmentType, fdRate, amount]);

  // Future Cost (Inflation) - shows what value is needed to maintain purchasing power
  const calculateFutureCost = useCallback((year: number, invested: number) => {
    if (investmentType === "sip") {
      // For SIP: Use annuity formula with inflation rate
      // This shows the accumulated value required to just beat inflation
      const monthlyRate = inflationRate / 100 / 12;
      const months = year * 12;
      const futureCost = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      return futureCost;
    } else {
      // For Lumpsum: P × (1 + r_inf)^t
      const inflationFactor = Math.pow(1 + inflationRate / 100, year);
      return invested * inflationFactor;
    }
  }, [investmentType, inflationRate, amount]);

  // Memoized chart data to prevent recalculation on every render
  const chartData = useMemo(() => {
    const data: ChartDataItem[] = [];
    for (let year = 1; year <= years; year++) {
      let invested: number;
      let mfReturns: number;

      if (investmentType === "sip") {
        invested = amount * 12 * year;
        const monthlyRate = returnRate / 100 / 12;
        const months = year * 12;
        const yearlyFV = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate));
        mfReturns = yearlyFV - invested;
      } else {
        invested = amount;
        const rate = returnRate / 100;
        const yearlyFV = amount * Math.pow(1 + rate, year);
        mfReturns = yearlyFV - invested;
      }

      const chartItem: ChartDataItem = {
        year: `Year ${year}`,
        invested,
        mfReturns,
      };

      if (compareWithFD) {
        const fdValue = calculateFDValue(year, invested);
        chartItem.fdInvested = fdValue.invested;
        chartItem.fdReturns = fdValue.returns;
      }

      if (compareWithInflation) {
        chartItem.futureCost = calculateFutureCost(year, invested);
      }

      data.push(chartItem);
    }
    return data;
  }, [amount, returnRate, years, investmentType, compareWithFD, compareWithInflation, calculateFDValue, calculateFutureCost]);

  const result = calculateResult();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Inputs */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Investment Type</Label>
          <Select value={investmentType} onValueChange={(value: "sip" | "lumpsum") => setInvestmentType(value)}>
            <SelectTrigger className="h-11 bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="sip">SIP (Monthly)</SelectItem>
              <SelectItem value="lumpsum">Lumpsum (One-time)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            {investmentType === "sip" ? "Monthly Investment (₹)" : "Investment Amount (₹)"}
          </Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[amount]}
            onValueChange={([value]) => setAmount(value)}
            min={investmentType === "sip" ? 500 : 10000}
            max={investmentType === "sip" ? 100000 : 10000000}
            step={investmentType === "sip" ? 500 : 10000}
            className="w-full"
            aria-label="Investment amount slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Expected Annual Return (%)</Label>
          <Input
            type="number"
            value={returnRate}
            onChange={(e) => setReturnRate(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[returnRate]}
            onValueChange={([value]) => setReturnRate(value)}
            min={1}
            max={30}
            step={0.5}
            className="w-full"
            aria-label="Expected return rate slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Time Period (Years)</Label>
          <Input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[years]}
            onValueChange={([value]) => setYears(value)}
            min={1}
            max={40}
            step={1}
            className="w-full"
            aria-label="Time period slider"
          />
        </div>

        {/* Comparison Toggles */}
        <div className="space-y-4 pt-4 border-t border-border">
          <Label className="text-sm font-medium text-foreground">Compare With</Label>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground cursor-pointer">Compare with FD Returns</Label>
              <Switch
                checked={compareWithFD}
                onCheckedChange={setCompareWithFD}
              />
            </div>
            
            {compareWithFD && (
              <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                <Label className="text-xs font-medium text-foreground">FD Interest Rate (%)</Label>
                <Input
                  type="number"
                  value={fdRate}
                  onChange={(e) => setFdRate(Number(e.target.value))}
                  className="h-9 bg-background border-border text-foreground text-sm"
                />
                <Slider
                  value={[fdRate]}
                  onValueChange={([value]) => setFdRate(value)}
                  min={3}
                  max={10}
                  step={0.25}
                  className="w-full"
                  aria-label="FD interest rate slider"
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground cursor-pointer">Compare with Inflation</Label>
              <Switch
                checked={compareWithInflation}
                onCheckedChange={setCompareWithInflation}
              />
            </div>
            
            {compareWithInflation && (
              <div className="space-y-2 pl-4 border-l-2 border-destructive/30">
                <Label className="text-xs font-medium text-foreground">Inflation Rate (%)</Label>
                <Input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="h-9 bg-background border-border text-foreground text-sm"
                />
                <Slider
                  value={[inflationRate]}
                  onValueChange={([value]) => setInflationRate(value)}
                  min={2}
                  max={12}
                  step={0.5}
                  className="w-full"
                  aria-label="Inflation rate slider"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Results & Chart */}
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Total Invested</span>
            <span className="font-bold text-foreground text-lg">{formatCurrency(result.invested)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Estimated Returns</span>
            <span className="font-bold text-accent text-lg">{formatCurrency(result.returns)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-foreground font-semibold">Future Value</span>
            <span className="font-bold text-primary text-xl">{formatCurrency(result.futureValue)}</span>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-muted/20 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  padding: "12px",
                }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold text-foreground mb-2">{label}</p>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">
                            Invested: <span className="text-foreground font-medium">{formatCurrency(data.invested)}</span>
                          </p>
                          <p className="text-muted-foreground">
                            Total MF Value: <span className="text-accent font-medium">{formatCurrency(data.invested + data.mfReturns)}</span>
                          </p>
                          {compareWithFD && data.fdReturns !== undefined && (
                            <p className="text-muted-foreground">
                              Total FD Value: <span className="font-medium" style={{ color: "hsl(210, 70%, 60%)" }}>{formatCurrency(data.fdInvested + data.fdReturns)}</span>
                            </p>
                          )}
                          {compareWithInflation && data.futureCost !== undefined && (
                            <p className="text-muted-foreground">
                              Future Cost: <span className="font-medium" style={{ color: "hsl(0, 70%, 60%)" }}>{formatCurrency(data.futureCost)}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
              <Bar dataKey="invested" stackId="mf" fill="hsl(210, 50%, 35%)" name="Invested" />
              <Bar dataKey="mfReturns" stackId="mf" fill="hsl(var(--accent))" name="MF Value" radius={[2, 2, 0, 0]} />
              {compareWithFD && (
                <>
                  <Bar dataKey="fdInvested" stackId="fd" fill="hsl(210, 50%, 35%)" name="Invested" legendType="none" />
                  <Bar dataKey="fdReturns" stackId="fd" fill="hsl(210, 70%, 60%)" name="FD Value" radius={[2, 2, 0, 0]} />
                </>
              )}
              {compareWithInflation && (
                <Bar dataKey="futureCost" fill="hsl(0, 70%, 60%)" name="Future Cost" radius={[2, 2, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SIPLumpsumCalculator;
