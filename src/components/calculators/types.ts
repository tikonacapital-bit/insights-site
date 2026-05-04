export interface CalculatorResult {
  invested: number;
  returns: number;
  futureValue: number;
}

export interface GoalPlanningResult {
  futureValue: number;
  requiredSIP: number;
  requiredLumpsum: number;
}

export interface CrorepatiResult {
  monthlySIP: number;
  totalInvested: number;
  targetedWealth: number;
  growthOfSavings: number;
  finalWealth: number;
}

export interface StepUpSIPResult {
  totalInvested: number;
  estimatedReturns: number;
  totalValue: number;
}

export interface SIPDelayResult {
  wealthWithoutDelay: number;
  wealthWithDelay: number;
  costOfDelay: number;
}

export interface AssetAllocationResult {
  equity: number;
  debt: number;
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatIndianNumber = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(value);
};
