export interface ManufacturerComparison {
  manufacturer: string;
  totalVehicles: number;
  avgRange: number;
  bevPercentage: number;
  phevPercentage: number;
  cafvEligiblePercentage: number;
  uniqueModels: number;
  avgModelYear: number;
  topCounties: Array<{ county: string; count: number }>;
  yearlyTrends: Array<{ year: number; count: number }>;
}

export interface ComparisonChartData {
  manufacturers: string[];
  rangeComparison: Array<{ manufacturer: string; avgRange: number }>;
  typeComparison: Array<{ manufacturer: string; bev: number; phev: number }>;
  eligibilityComparison: Array<{ manufacturer: string; eligible: number; notEligible: number }>;
  modelsComparison: Array<{ manufacturer: string; uniqueModels: number }>;
  trendsComparison: Array<{ manufacturer: string; data: Array<{ year: number; count: number }> }>;
  geoComparison: Array<{ manufacturer: string; topCounty: string; count: number }>;
}

export interface ComparisonToggleProps {
  showComparison: boolean;
  onToggleChange: (show: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export interface ComparisonChartsProps {
  comparisonData: ComparisonChartData;
  className?: string;
}
