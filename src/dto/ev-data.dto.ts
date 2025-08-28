export interface EVData {
  vin: string;
  county: string;
  city: string;
  state: string;
  postalCode: string;
  modelYear: number;
  make: string;
  model: string;
  electricVehicleType: string;
  cafvEligibility: string;
  electricRange: number;
  baseMSRP: number;
  legislativeDistrict: number;
  dolVehicleId: string;
  vehicleLocation: string;
  electricUtility: string;
  censusTract: string;
  coordinates?: [number, number];
}

export interface SummaryStats {
  totalVehicles: number;
  avgRange: number;
  uniqueManufacturers: number;
  uniqueModels: number;
  yearRange: [number, number];
}

export interface DataFilters {
  make?: string;
  makes?: string[];
  evType?: string;
  county?: string;
  yearRange?: [number, number];
}
