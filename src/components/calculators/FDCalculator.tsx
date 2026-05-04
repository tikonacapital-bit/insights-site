import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "./types";

const FDCalculator = () => {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const [frequency, setFrequency] = useState<"monthly" | "quarterly" | "yearly">("quarterly");

  const calculateFD = () => {
    const n = frequency === "monthly" ? 12 : frequency === "quarterly" ? 4 : 1;
    const maturityAmount = amount * Math.pow(1 + rate / 100 / n, n * years);
    const invested = amount;
    const returns = maturityAmount - invested;
    return { futureValue: maturityAmount, invested, returns };
  };

  const generateChartData = () => {
    const data = [];
    const n = frequency === "monthly" ? 12 : frequency === "quarterly" ? 4 : 1;
    for (let year = 1; year <= years; year++) {
      const yearlyFV = amount * Math.pow(1 + rate / 100 / n, n * year);
      const interest = yearlyFV - amount;
      data.push({
        year: `Year ${year}`,
        principal: amount,
        interest: interest,
        total: yearlyFV,
      });
    }
    return data;
  };

  const result = calculateFD();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Inputs */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Principal Amount (₹)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[amount]}
            onValueChange={([value]) => setAmount(value)}
            min={10000}
            max={10000000}
            step={10000}
            className="w-full"
            aria-label="Principal amount slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Interest Rate (%)</Label>
          <Input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[rate]}
            onValueChange={([value]) => setRate(value)}
            min={1}
            max={15}
            step={0.25}
            className="w-full"
            aria-label="Interest rate slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Tenure (Years)</Label>
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
            max={10}
            step={1}
            className="w-full"
            aria-label="Tenure slider"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Compounding Frequency</Label>
          <Select value={frequency} onValueChange={(value: "monthly" | "quarterly" | "yearly") => setFrequency(value)}>
            <SelectTrigger className="h-11 bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right Column - Results & Chart */}
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Principal Amount</span>
            <span className="font-bold text-foreground text-lg">{formatCurrency(result.invested)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Interest Earned</span>
            <span className="font-bold text-accent text-lg">{formatCurrency(result.returns)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-foreground font-semibold">Maturity Amount</span>
            <span className="font-bold text-primary text-xl">{formatCurrency(result.futureValue)}</span>
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
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="text-sm font-medium text-foreground mb-2">{data.year}</p>
                        <p className="text-muted-foreground text-sm">
                          Principal: <span className="text-foreground font-medium">{formatCurrency(data.principal)}</span>
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Interest: <span className="text-accent font-medium">{formatCurrency(data.interest)}</span>
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Total Value: <span className="text-primary font-medium">{formatCurrency(data.total)}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="principal" stackId="fd" fill="hsl(210, 50%, 35%)" name="Principal" />
              <Bar dataKey="interest" stackId="fd" fill="hsl(var(--accent))" name="Interest" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FDCalculator;
