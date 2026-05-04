import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "./types";

const SIPDelayCalculator = () => {
  const [monthlyAmount, setMonthlyAmount] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [tenure, setTenure] = useState(20);
  const [delayPeriod, setDelayPeriod] = useState(2); // Years

  const calculateSIPValue = (months: number) => {
    const monthlyRate = expectedReturn / 100 / 12;
    if (months <= 0) return 0;
    return monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  };

  const wealthWithoutDelay = calculateSIPValue(tenure * 12);
  const wealthWithDelay = calculateSIPValue((tenure - delayPeriod) * 12);
  const costOfDelay = wealthWithoutDelay - wealthWithDelay;
  const investedWithoutDelay = monthlyAmount * tenure * 12;
  const investedWithDelay = monthlyAmount * (tenure - delayPeriod) * 12;

  const chartData = [
    {
      name: "Start Now",
      invested: investedWithoutDelay,
      returns: wealthWithoutDelay - investedWithoutDelay,
      total: wealthWithoutDelay,
    },
    {
      name: `${delayPeriod} Year${delayPeriod > 1 ? 's' : ''} Delay`,
      invested: investedWithDelay,
      returns: wealthWithDelay - investedWithDelay,
      total: wealthWithDelay,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Inputs */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Monthly SIP Amount (₹)</Label>
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
            aria-label="Monthly SIP amount slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Expected Rate of Return (%)</Label>
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

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Investment Tenure (Years)</Label>
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
            aria-label="Investment tenure slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Delay Period (Years)</Label>
          <Input
            type="number"
            value={delayPeriod}
            onChange={(e) => setDelayPeriod(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[delayPeriod]}
            onValueChange={([value]) => setDelayPeriod(value)}
            min={1}
            max={Math.min(10, tenure - 1)}
            step={1}
            className="w-full"
            aria-label="Delay period slider"
          />
        </div>
      </div>

      {/* Right Column - Results & Chart */}
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Wealth if you start now</span>
            <span className="font-bold text-accent text-lg">{formatCurrency(wealthWithoutDelay)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Wealth with {delayPeriod} year{delayPeriod > 1 ? 's' : ''} delay</span>
            <span className="font-bold text-foreground text-lg">{formatCurrency(wealthWithDelay)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-destructive font-semibold">Cost of Delay</span>
            <span className="font-bold text-destructive text-xl">{formatCurrency(costOfDelay)}</span>
          </div>
        </div>

        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
          <p className="text-sm text-foreground">
            <strong>Note:</strong> Delaying your SIP by just {delayPeriod} year{delayPeriod > 1 ? 's' : ''} costs you{" "}
            <span className="font-bold text-destructive">{formatCurrency(costOfDelay)}</span> in potential wealth!
          </p>
        </div>

        {/* Chart */}
        <div className="bg-muted/20 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="invested" stackId="a" fill="hsl(var(--primary))" name="Invested" />
              <Bar dataKey="returns" stackId="a" fill="hsl(var(--accent))" name="Returns" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SIPDelayCalculator;
