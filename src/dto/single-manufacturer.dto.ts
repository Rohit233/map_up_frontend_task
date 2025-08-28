export interface SingleManufacturerAnalysis {
  manufacturer: string;
  totalVehicles: number;
  
  // Model Analysis
  modelBreakdown: Array<{
    model: string;
    count: number;
    percentage: number;
    avgRange: number;
    avgYear: number;
    bevCount: number;
    phevCount: number;
  }>;
  
  // Geographic Analysis
  countyDistribution: Array<{
    county: string;
    count: number;
    percentage: number;
  }>;
  
  cityDistribution: Array<{
    city: string;
    count: number;
    percentage: number;
  }>;
  
  // Time Analysis
  yearlyRegistrations: Array<{
    year: number;
    count: number;
    models: string[];
  }>;
  
  // Range Analysis
  rangeStats: {
    avgRange: number;
    minRange: number;
    maxRange: number;
    rangeDistribution: Array<{
      range: string;
      count: number;
    }>;
  };
  
  // EV Type Analysis
  evTypeBreakdown: {
    bev: { count: number; percentage: number; avgRange: number };
    phev: { count: number; percentage: number; avgRange: number };
  };
  
  // CAFV Analysis
  cafvBreakdown: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  
  // Utility Analysis
  electricUtilities: Array<{
    utility: string;
    count: number;
    percentage: number;
  }>;
  
  // Legislative District Analysis
  legislativeDistricts: Array<{
    district: number;
    count: number;
    percentage: number;
  }>;
  
  // Summary Stats
  summaryStats: {
    mostPopularModel: string;
    mostPopularCounty: string;
    mostPopularCity: string;
    peakRegistrationYear: number;
    avgModelYear: number;
    newestModelYear: number;
    oldestModelYear: number;
  };
}

export interface SingleManufacturerAnalysisProps {
  data: SingleManufacturerAnalysis;
  className?: string;
}

export interface ModelDetailCardProps {
  model: {
    model: string;
    count: number;
    percentage: number;
    avgRange: number;
    avgYear: number;
    bevCount: number;
    phevCount: number;
  };
  className?: string;
}
