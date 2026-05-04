import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import DonutChart from "./DonutChart";
import { formatCurrency } from "./types";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [rate, setRate] = useState(9);
  const [tenure, setTenure] = useState(240); // months

  const calculateEMI = () => {
    const monthlyRate = rate / 100 / 12;
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - loanAmount;
    return { emi, totalPayment, totalInterest, principal: loanAmount };
  };


  const result = calculateEMI();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Inputs */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Loan Amount (₹)</Label>
          <Input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[loanAmount]}
            onValueChange={([value]) => setLoanAmount(value)}
            min={100000}
            max={50000000}
            step={100000}
            className="w-full"
            aria-label="Loan amount slider"
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
            min={5}
            max={20}
            step={0.25}
            className="w-full"
            aria-label="Interest rate slider"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Loan Tenure (Months)</Label>
          <Input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="h-11 bg-background border-border text-foreground"
          />
          <Slider
            value={[tenure]}
            onValueChange={([value]) => setTenure(value)}
            min={12}
            max={360}
            step={12}
            className="w-full"
            aria-label="Loan tenure slider"
          />
        </div>
      </div>

      {/* Right Column - Results & Chart */}
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Monthly EMI</span>
            <span className="font-bold text-primary text-lg">{formatCurrency(result.emi)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Principal Amount</span>
            <span className="font-bold text-foreground text-lg">{formatCurrency(result.principal)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Total Interest</span>
            <span className="font-bold text-accent text-lg">{formatCurrency(result.totalInterest)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-foreground font-semibold">Total Payment</span>
            <span className="font-bold text-primary text-xl">{formatCurrency(result.totalPayment)}</span>
          </div>
        </div>

        {/* Chart */}
        <div className="flex flex-col items-center justify-center bg-muted/20 rounded-xl p-4">
          <DonutChart
            invested={result.principal}
            returns={result.totalInterest}
            investedLabel="Principal Amount"
            returnsLabel="Interest"
          />
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
