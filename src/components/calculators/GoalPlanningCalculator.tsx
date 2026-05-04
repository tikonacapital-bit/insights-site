import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DonutChart from "./DonutChart";
import { formatCurrency } from "./types";

type GoalType = "education" | "marriage" | "car" | "house" | "vacation" | "retirement";

const GoalPlanningCalculator = () => {
  const [goalType, setGoalType] = useState<GoalType>("education");

  // Common states
  const [currentAge, setCurrentAge] = useState(10);
  const [targetAge, setTargetAge] = useState(25);
  const [currentCost, setCurrentCost] = useState(5000000);
  const [inflationRate, setInflationRate] = useState(7);
  const [expectedReturn, setExpectedReturn] = useState(12);
  
  // Retirement specific
  const [lifeExpectancy, setLifeExpectancy] = useState(80);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [postRetirementReturn, setPostRetirementReturn] = useState(8);

  const getYears = () => {
    if (goalType === "retirement") return targetAge - currentAge;
    if (goalType === "education" || goalType === "marriage") return targetAge - currentAge;
    return targetAge; // For car, house, vacation - targetAge is years until purchase
  };

  const calculateFutureValue = () => {
    const years = getYears();
    if (goalType === "retirement") {
      // For retirement, calculate corpus needed
      const yearsInRetirement = lifeExpectancy - targetAge;
      const inflationAdjustedExpense = monthlyExpenses * Math.pow(1 + inflationRate / 100, years);
      const annualExpense = inflationAdjustedExpense * 12;
      // Using present value of annuity formula adjusted for inflation
      const realRate = (1 + postRetirementReturn / 100) / (1 + inflationRate / 100) - 1;
      const corpus = annualExpense * ((1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate);
      return corpus;
    }
    return currentCost * Math.pow(1 + inflationRate / 100, years);
  };

  const calculateRequiredSIP = (futureValue: number) => {
    const years = getYears();
    const monthlyRate = expectedReturn / 100 / 12;
    const months = years * 12;
    // FV = SIP * ((((1+r)^n) - 1) / r) * (1+r)
    // SIP = FV / ((((1+r)^n) - 1) / r) * (1+r)
    const sip = futureValue / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    return sip;
  };

  const calculateRequiredLumpsum = (futureValue: number) => {
    const years = getYears();
    const rate = expectedReturn / 100;
    return futureValue / Math.pow(1 + rate, years);
  };

  const futureValue = calculateFutureValue();
  const requiredSIP = calculateRequiredSIP(futureValue);
  const requiredLumpsum = calculateRequiredLumpsum(futureValue);
  const years = getYears();
  const totalSIPInvestment = requiredSIP * years * 12;

  const getGoalConfig = () => {
    switch (goalType) {
      case "education":
        return {
          title: "Child Education Planning",
          ageLabel: "Child's Current Age",
          targetLabel: "Age of Higher Education",
          costLabel: "Current Cost of Education",
          chartLabel: "Invested Amount for Higher Education",
        };
      case "marriage":
        return {
          title: "Marriage Planning",
          ageLabel: "Child's Current Age",
          targetLabel: "Expected Age at Marriage",
          costLabel: "Current Marriage Expenses",
          chartLabel: "Invested Amount for Marriage",
        };
      case "car":
        return {
          title: "Dream Car Planning",
          ageLabel: null,
          targetLabel: "Years until purchase",
          costLabel: "Current Cost of Car",
          chartLabel: "Amount Invested for Car",
        };
      case "house":
        return {
          title: "Dream House Planning",
          ageLabel: null,
          targetLabel: "Years until purchase",
          costLabel: "Current Cost of House",
          chartLabel: "Amount Invested for House",
        };
      case "vacation":
        return {
          title: "Vacation Planning",
          ageLabel: null,
          targetLabel: "Years until vacation",
          costLabel: "Current Vacation Cost",
          chartLabel: "Amount Invested for Vacation",
        };
      case "retirement":
        return {
          title: "Retirement Planning",
          ageLabel: "Current Age",
          targetLabel: "Retirement Age",
          costLabel: null,
          chartLabel: "Amount Invested for Retirement",
        };
    }
  };

  const config = getGoalConfig();

  return (
    <div className="space-y-6">
      {/* Goal Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "education", label: "Education" },
          { value: "marriage", label: "Marriage" },
          { value: "car", label: "Dream Car" },
          { value: "house", label: "Dream House" },
          { value: "vacation", label: "Vacation" },
          { value: "retirement", label: "Retirement" },
        ].map((goal) => (
          <button
            key={goal.value}
            onClick={() => setGoalType(goal.value as GoalType)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              goalType === goal.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {goal.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {config.ageLabel && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">{config.ageLabel}</Label>
              <Input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="h-11 bg-background border-border text-foreground"
              />
              <Slider
                value={[currentAge]}
                onValueChange={([value]) => setCurrentAge(value)}
                min={goalType === "retirement" ? 20 : 0}
                max={goalType === "retirement" ? 60 : 18}
                step={1}
                className="w-full"
                aria-label="Current age slider"
              />
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">{config.targetLabel}</Label>
            <Input
              type="number"
              value={targetAge}
              onChange={(e) => setTargetAge(Number(e.target.value))}
              className="h-11 bg-background border-border text-foreground"
            />
            <Slider
              value={[targetAge]}
              onValueChange={([value]) => setTargetAge(value)}
              min={goalType === "education" || goalType === "marriage" ? currentAge + 1 : 1}
              max={goalType === "retirement" ? 70 : goalType === "education" || goalType === "marriage" ? 40 : 30}
              step={1}
              className="w-full"
              aria-label="Target age or years slider"
            />
          </div>

          {goalType === "retirement" && (
            <>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">Life Expectancy</Label>
                <Input
                  type="number"
                  value={lifeExpectancy}
                  onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                  className="h-11 bg-background border-border text-foreground"
                />
                <Slider
                  value={[lifeExpectancy]}
                  onValueChange={([value]) => setLifeExpectancy(value)}
                  min={targetAge + 1}
                  max={100}
                  step={1}
                  className="w-full"
                  aria-label="Life expectancy slider"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">Current Monthly Expenses (₹)</Label>
                <Input
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="h-11 bg-background border-border text-foreground"
                />
                <Slider
                  value={[monthlyExpenses]}
                  onValueChange={([value]) => setMonthlyExpenses(value)}
                  min={10000}
                  max={500000}
                  step={5000}
                  className="w-full"
                  aria-label="Monthly expenses slider"
                />
              </div>
            </>
          )}

          {config.costLabel && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">{config.costLabel} (₹)</Label>
              <Input
                type="number"
                value={currentCost}
                onChange={(e) => setCurrentCost(Number(e.target.value))}
                className="h-11 bg-background border-border text-foreground"
              />
              <Slider
                value={[currentCost]}
                onValueChange={([value]) => setCurrentCost(value)}
                min={goalType === "vacation" ? 10000 : goalType === "car" ? 500000 : 100000}
                max={goalType === "vacation" ? 1000000 : goalType === "house" ? 50000000 : 10000000}
                step={goalType === "vacation" ? 10000 : 100000}
                className="w-full"
                aria-label="Current cost slider"
              />
            </div>
          )}

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
            <Label className="text-sm font-medium text-foreground">
              {goalType === "retirement" ? "Pre-retirement Returns (%)" : "Expected Returns (%)"}
            </Label>
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
              aria-label="Expected returns slider"
            />
          </div>

          {goalType === "retirement" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">Post-retirement Returns (%)</Label>
              <Input
                type="number"
                value={postRetirementReturn}
                onChange={(e) => setPostRetirementReturn(Number(e.target.value))}
                className="h-11 bg-background border-border text-foreground"
              />
              <Slider
                value={[postRetirementReturn]}
                onValueChange={([value]) => setPostRetirementReturn(value)}
                min={1}
                max={15}
                step={0.5}
                className="w-full"
                aria-label="Post-retirement returns slider"
              />
            </div>
          )}
        </div>

        {/* Right Column - Results & Chart */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">
                {goalType === "retirement" ? "Retirement Corpus Required" : `Future ${config.costLabel?.replace("Current ", "")}`}
              </span>
              <span className="font-bold text-foreground text-lg">{formatCurrency(futureValue)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Amount Required via SIP</span>
              <span className="font-bold text-accent text-lg">{formatCurrency(requiredSIP)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-foreground font-semibold">Amount Required via Lumpsum</span>
              <span className="font-bold text-primary text-xl">{formatCurrency(requiredLumpsum)}</span>
            </div>
          </div>

          {/* Chart */}
          <div className="flex flex-col items-center justify-center bg-muted/20 rounded-xl p-4">
            <DonutChart
              invested={totalSIPInvestment}
              returns={futureValue - totalSIPInvestment}
              investedLabel={config.chartLabel}
              returnsLabel="Est. Returns"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalPlanningCalculator;
