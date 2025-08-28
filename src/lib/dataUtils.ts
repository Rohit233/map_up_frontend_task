import * as d3 from 'd3';
import Papa from 'papaparse';
import { EVData, SummaryStats, DataFilters, ChartData, TimeSeriesData, ManufacturerComparison, ComparisonChartData, SingleManufacturerAnalysis } from '@/dto';

export class DataProcessor {
  private data: EVData[] = [];

  constructor(data: EVData[]) {
    this.data = data;
  }

  // Parse CSV data using Papa Parse (CSP-friendly alternative to d3.csvParse)
  static parseCSVData(csvData: string): EVData[] {
    const parseResult = Papa.parse<Record<string, string>>(csvData, {
      header: true,
      skipEmptyLines: true,
      transform: (value: string) => value.trim()
    });

    if (parseResult.errors.length > 0) {
      console.warn('CSV parsing errors:', parseResult.errors);
    }

    const parsedData = parseResult.data.map((d) => {
      // Extract coordinates from POINT string
      let coordinates: [number, number] | undefined;
      const locationMatch = d['Vehicle Location']?.match(/POINT \((-?\d+\.?\d*) (-?\d+\.?\d*)\)/);
      if (locationMatch) {
        coordinates = [parseFloat(locationMatch[1]), parseFloat(locationMatch[2])];
      }

      return {
        vin: d['VIN (1-10)'] || '',
        county: d['County'] || '',
        city: d['City'] || '',
        state: d['State'] || '',
        postalCode: d['Postal Code'] || '',
        modelYear: parseInt(d['Model Year'] || '0'),
        make: d['Make'] || '',
        model: d['Model'] || '',
        electricVehicleType: d['Electric Vehicle Type'] || '',
        cafvEligibility: d['Clean Alternative Fuel Vehicle (CAFV) Eligibility'] || '',
        electricRange: parseInt(d['Electric Range'] || '0'),
        baseMSRP: parseInt(d['Base MSRP'] || '0'),
        legislativeDistrict: parseInt(d['Legislative District'] || '0'),
        dolVehicleId: d['DOL Vehicle ID'] || '',
        vehicleLocation: d['Vehicle Location'] || '',
        electricUtility: d['Electric Utility'] || '',
        censusTract: d['2020 Census Tract'] || '',
        coordinates
      } as EVData;
    });

    return parsedData.filter(d => d !== null && d.make && d.model) as EVData[];
  }

  // Get EV type distribution
  getEVTypeDistribution(): ChartData[] {
    const typeCounts = d3.rollup(this.data, v => v.length, d => d.electricVehicleType);
    const total = this.data.length;
    
    return Array.from(typeCounts, ([type, count]) => ({
      label: type,
      value: count,
      percentage: (count / total) * 100
    }));
  }

  // Get top manufacturers
  getTopManufacturers(limit: number = 10): ChartData[] {
    const makeCounts = d3.rollup(this.data, v => v.length, d => d.make);
    const sortedMakes = Array.from(makeCounts, ([make, count]) => ({
      label: make,
      value: count
    })).sort((a, b) => b.value - a.value);
    
    return sortedMakes.slice(0, limit);
  }

  // Get county distribution
  getCountyDistribution(limit: number = 15): ChartData[] {
    const countyCounts = d3.rollup(this.data, v => v.length, d => d.county);
    const sortedCounties = Array.from(countyCounts, ([county, count]) => ({
      label: county,
      value: count
    })).sort((a, b) => b.value - a.value);
    
    return sortedCounties.slice(0, limit);
  }

  // Get time series data
  getTimeSeriesData(): TimeSeriesData[] {
    const yearCounts = d3.rollup(this.data, v => v.length, d => d.modelYear);
    return Array.from(yearCounts, ([year, count]) => ({
      year,
      count
    })).sort((a, b) => a.year - b.year);
  }

  // Get electric range distribution
  getRangeDistribution(): ChartData[] {
    const ranges = this.data.map(d => d.electricRange).filter(r => r > 0);
    const bins = d3.bin()
      .domain(d3.extent(ranges) as [number, number])
      .thresholds(20)(ranges);

    return bins.map(bin => ({
      label: `${Math.round(bin.x0 || 0)}-${Math.round(bin.x1 || 0)}`,
      value: bin.length
    }));
  }

  // Get CAFV eligibility distribution
  getCAFVEligibilityDistribution(): ChartData[] {
    const eligibilityCounts = d3.rollup(this.data, v => v.length, d => d.cafvEligibility);
    const total = this.data.length;
    
    return Array.from(eligibilityCounts, ([status, count]) => ({
      label: status,
      value: count,
      percentage: (count / total) * 100
    }));
  }

  // Get summary statistics
  getSummaryStats(): SummaryStats {
    const totalVehicles = this.data.length;
    const avgRange = d3.mean(this.data.filter(d => d.electricRange > 0), d => d.electricRange) || 0;
    const uniqueManufacturers = new Set(this.data.map(d => d.make)).size;
    const uniqueModels = new Set(this.data.map(d => d.model)).size;
    const yearRange = d3.extent(this.data, d => d.modelYear) as [number, number];

    return {
      totalVehicles,
      avgRange: Math.round(avgRange),
      uniqueManufacturers,
      uniqueModels,
      yearRange
    };
  }

  // Get data for specific filters
  filterData(filters: DataFilters): EVData[] {
    return this.data.filter(d => {
      if (filters.make && d.make !== filters.make) return false;
      if (filters.makes && filters.makes.length > 0 && !filters.makes.includes(d.make)) return false;
      if (filters.evType && d.electricVehicleType !== filters.evType) return false;
      if (filters.county && d.county !== filters.county) return false;
      if (filters.yearRange) {
        const [minYear, maxYear] = filters.yearRange;
        if (d.modelYear < minYear || d.modelYear > maxYear) return false;
      }
      return true;
    });
  }

  // Generate manufacturer comparison data
  getManufacturerComparison(manufacturer: string): ManufacturerComparison {
    const manufacturerData = this.data.filter(d => d.make === manufacturer);
    
    if (manufacturerData.length === 0) {
      return {
        manufacturer,
        totalVehicles: 0,
        avgRange: 0,
        bevPercentage: 0,
        phevPercentage: 0,
        cafvEligiblePercentage: 0,
        uniqueModels: 0,
        avgModelYear: 0,
        topCounties: [],
        yearlyTrends: [],
      };
    }

    // Calculate metrics
    const totalVehicles = manufacturerData.length;
    const rangesWithValues = manufacturerData.filter(d => d.electricRange > 0);
    const avgRange = rangesWithValues.length > 0 
      ? Math.round(d3.mean(rangesWithValues, d => d.electricRange) || 0)
      : 0;
    
    const bevCount = manufacturerData.filter(d => d.electricVehicleType === 'Battery Electric Vehicle (BEV)').length;
    const phevCount = manufacturerData.filter(d => d.electricVehicleType === 'Plug-in Hybrid Electric Vehicle (PHEV)').length;
    
    const bevPercentage = Math.round((bevCount / totalVehicles) * 100);
    const phevPercentage = Math.round((phevCount / totalVehicles) * 100);
    
    const eligibleCount = manufacturerData.filter(d => 
      d.cafvEligibility === 'Clean Alternative Fuel Vehicle Eligible'
    ).length;
    const cafvEligiblePercentage = Math.round((eligibleCount / totalVehicles) * 100);
    
    const uniqueModels = new Set(manufacturerData.map(d => d.model)).size;
    const avgModelYear = Math.round(d3.mean(manufacturerData, d => d.modelYear) || 0);
    
    // Top counties
    const countyCounts = d3.rollup(manufacturerData, v => v.length, d => d.county);
    const topCounties = Array.from(countyCounts, ([county, count]) => ({ county, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
    
    // Yearly trends
    const yearCounts = d3.rollup(manufacturerData, v => v.length, d => d.modelYear);
    const yearlyTrends = Array.from(yearCounts, ([year, count]) => ({ year, count }))
      .sort((a, b) => a.year - b.year);

    return {
      manufacturer,
      totalVehicles,
      avgRange,
      bevPercentage,
      phevPercentage,
      cafvEligiblePercentage,
      uniqueModels,
      avgModelYear,
      topCounties,
      yearlyTrends,
    };
  }

  // Generate comprehensive comparison data for multiple manufacturers
  getComparisonData(manufacturers: string[]): ComparisonChartData {
    const comparisons = manufacturers.map(manufacturer => 
      this.getManufacturerComparison(manufacturer)
    );

    // Range comparison
    const rangeComparison = comparisons.map(comp => ({
      manufacturer: comp.manufacturer,
      avgRange: comp.avgRange,
    }));

    // Type comparison
    const typeComparison = comparisons.map(comp => ({
      manufacturer: comp.manufacturer,
      bev: Math.round((comp.bevPercentage / 100) * comp.totalVehicles),
      phev: Math.round((comp.phevPercentage / 100) * comp.totalVehicles),
    }));

    // Eligibility comparison
    const eligibilityComparison = comparisons.map(comp => ({
      manufacturer: comp.manufacturer,
      eligible: Math.round((comp.cafvEligiblePercentage / 100) * comp.totalVehicles),
      notEligible: comp.totalVehicles - Math.round((comp.cafvEligiblePercentage / 100) * comp.totalVehicles),
    }));

    // Models comparison
    const modelsComparison = comparisons.map(comp => ({
      manufacturer: comp.manufacturer,
      uniqueModels: comp.uniqueModels,
    }));

    // Trends comparison
    const trendsComparison = comparisons.map(comp => ({
      manufacturer: comp.manufacturer,
      data: comp.yearlyTrends,
    }));

    // Geographic comparison
    const geoComparison = comparisons.map(comp => ({
      manufacturer: comp.manufacturer,
      topCounty: comp.topCounties[0]?.county || 'N/A',
      count: comp.topCounties[0]?.count || 0,
    }));

    return {
      manufacturers,
      rangeComparison,
      typeComparison,
      eligibilityComparison,
      modelsComparison,
      trendsComparison,
      geoComparison,
    };
  }

  // Generate comprehensive single manufacturer analysis
  getSingleManufacturerAnalysis(manufacturer: string): SingleManufacturerAnalysis {
    const manufacturerData = this.data.filter(d => d.make === manufacturer);
    
    if (manufacturerData.length === 0) {
      // Return empty analysis if no data
      return {
        manufacturer,
        totalVehicles: 0,
        modelBreakdown: [],
        countyDistribution: [],
        cityDistribution: [],
        yearlyRegistrations: [],
        rangeStats: {
          avgRange: 0,
          minRange: 0,
          maxRange: 0,
          rangeDistribution: []
        },
        evTypeBreakdown: {
          bev: { count: 0, percentage: 0, avgRange: 0 },
          phev: { count: 0, percentage: 0, avgRange: 0 }
        },
        cafvBreakdown: [],
        electricUtilities: [],
        legislativeDistricts: [],
        summaryStats: {
          mostPopularModel: '',
          mostPopularCounty: '',
          mostPopularCity: '',
          peakRegistrationYear: 0,
          avgModelYear: 0,
          newestModelYear: 0,
          oldestModelYear: 0
        }
      };
    }

    const totalVehicles = manufacturerData.length;

    // Model Breakdown Analysis
    const modelCounts = d3.rollup(manufacturerData, v => v, d => d.model);
    const modelBreakdown = Array.from(modelCounts, ([model, vehicles]) => {
      const count = vehicles.length;
      const percentage = (count / totalVehicles) * 100;
      const rangesWithValues = vehicles.filter(v => v.electricRange > 0);
      const avgRange = rangesWithValues.length > 0 
        ? Math.round(d3.mean(rangesWithValues, v => v.electricRange) || 0)
        : 0;
      const avgYear = Math.round(d3.mean(vehicles, v => v.modelYear) || 0);
      const bevCount = vehicles.filter(v => v.electricVehicleType === 'Battery Electric Vehicle (BEV)').length;
      const phevCount = vehicles.filter(v => v.electricVehicleType === 'Plug-in Hybrid Electric Vehicle (PHEV)').length;
      
      return {
        model,
        count,
        percentage,
        avgRange,
        avgYear,
        bevCount,
        phevCount
      };
    }).sort((a, b) => b.count - a.count);

    // County Distribution
    const countyCounts = d3.rollup(manufacturerData, v => v.length, d => d.county);
    const countyDistribution = Array.from(countyCounts, ([county, count]) => ({
      county,
      count,
      percentage: (count / totalVehicles) * 100
    })).sort((a, b) => b.count - a.count);

    // City Distribution
    const cityCounts = d3.rollup(manufacturerData, v => v.length, d => d.city);
    const cityDistribution = Array.from(cityCounts, ([city, count]) => ({
      city,
      count,
      percentage: (count / totalVehicles) * 100
    })).sort((a, b) => b.count - a.count);

    // Yearly Registrations
    const yearCounts = d3.rollup(manufacturerData, v => v, d => d.modelYear);
    const yearlyRegistrations = Array.from(yearCounts, ([year, vehicles]) => ({
      year,
      count: vehicles.length,
      models: Array.from(new Set(vehicles.map(v => v.model)))
    })).sort((a, b) => a.year - b.year);

    // Range Statistics
    const rangesWithValues = manufacturerData.filter(d => d.electricRange > 0);
    const ranges = rangesWithValues.map(d => d.electricRange);
    const avgRange = ranges.length > 0 ? Math.round(d3.mean(ranges) || 0) : 0;
    const minRange = ranges.length > 0 ? Math.min(...ranges) : 0;
    const maxRange = ranges.length > 0 ? Math.max(...ranges) : 0;

    // Range distribution bins
    const rangeBins = d3.bin()
      .domain([0, maxRange])
      .thresholds(10)(ranges);
    
    const rangeDistribution = rangeBins.map(bin => ({
      range: `${Math.round(bin.x0 || 0)}-${Math.round(bin.x1 || 0)}`,
      count: bin.length
    }));

    // EV Type Breakdown
    const bevVehicles = manufacturerData.filter(d => d.electricVehicleType === 'Battery Electric Vehicle (BEV)');
    const phevVehicles = manufacturerData.filter(d => d.electricVehicleType === 'Plug-in Hybrid Electric Vehicle (PHEV)');
    
    const bevRanges = bevVehicles.filter(v => v.electricRange > 0).map(v => v.electricRange);
    const phevRanges = phevVehicles.filter(v => v.electricRange > 0).map(v => v.electricRange);
    
    const evTypeBreakdown = {
      bev: {
        count: bevVehicles.length,
        percentage: (bevVehicles.length / totalVehicles) * 100,
        avgRange: bevRanges.length > 0 ? Math.round(d3.mean(bevRanges) || 0) : 0
      },
      phev: {
        count: phevVehicles.length,
        percentage: (phevVehicles.length / totalVehicles) * 100,
        avgRange: phevRanges.length > 0 ? Math.round(d3.mean(phevRanges) || 0) : 0
      }
    };

    // CAFV Breakdown
    const cafvCounts = d3.rollup(manufacturerData, v => v.length, d => d.cafvEligibility);
    const cafvBreakdown = Array.from(cafvCounts, ([status, count]) => ({
      status,
      count,
      percentage: (count / totalVehicles) * 100
    }));

    // Electric Utilities
    const utilityCounts = d3.rollup(manufacturerData, v => v.length, d => d.electricUtility);
    const electricUtilities = Array.from(utilityCounts, ([utility, count]) => ({
      utility,
      count,
      percentage: (count / totalVehicles) * 100
    })).sort((a, b) => b.count - a.count);

    // Legislative Districts
    const districtCounts = d3.rollup(manufacturerData, v => v.length, d => d.legislativeDistrict);
    const legislativeDistricts = Array.from(districtCounts, ([district, count]) => ({
      district,
      count,
      percentage: (count / totalVehicles) * 100
    })).sort((a, b) => b.count - a.count);

    // Summary Statistics
    const years = manufacturerData.map(d => d.modelYear).filter(y => y > 0);
    const peakYear = yearlyRegistrations.reduce((max, curr) => 
      curr.count > max.count ? curr : max, yearlyRegistrations[0]);
    
    const summaryStats = {
      mostPopularModel: modelBreakdown[0]?.model || '',
      mostPopularCounty: countyDistribution[0]?.county || '',
      mostPopularCity: cityDistribution[0]?.city || '',
      peakRegistrationYear: peakYear?.year || 0,
      avgModelYear: Math.round(d3.mean(years) || 0),
      newestModelYear: Math.max(...years),
      oldestModelYear: Math.min(...years)
    };

    return {
      manufacturer,
      totalVehicles,
      modelBreakdown,
      countyDistribution,
      cityDistribution,
      yearlyRegistrations,
      rangeStats: {
        avgRange,
        minRange,
        maxRange,
        rangeDistribution
      },
      evTypeBreakdown,
      cafvBreakdown,
      electricUtilities,
      legislativeDistricts,
      summaryStats
    };
  }
}
