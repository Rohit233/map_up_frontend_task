"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DataProcessor } from "@/lib/dataUtils";
import { EVData, DashboardProps, FilterState } from "@/dto";
import { PieChart, BarChart, LineChart, Histogram } from "./Chart";
import { MetricGrid } from "./StatsCard";
import { FilterPanel } from "./Filters";
import { ComparisonCharts } from "./ComparisonCharts";
import { SingleManufacturerAnalysis } from "./SingleManufacturerAnalysis";

export const Dashboard: React.FC<DashboardProps> = ({ className = "" }) => {
  const [data, setData] = useState<EVData[]>([]);
  const [processor, setProcessor] = useState<DataProcessor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    selectedManufacturers: [],
    yearRange: [2000, 2024],
    showComparison: false,
  });

  // Get unique manufacturers for filter dropdown (need this before early returns)
  const availableManufacturers = useMemo(() => {
    if (data.length === 0) return [];
    const makes = Array.from(new Set(data.map(d => d.make))).filter(Boolean);
    return makes.sort();
  }, [data]);

  // Get year range for filter (need this before early returns)
  const availableYearRange = useMemo((): [number, number] => {
    if (data.length === 0) return [2000, 2024];
    const years = data.map(d => d.modelYear).filter(y => y > 0);
    return [Math.min(...years), Math.max(...years)];
  }, [data]);

  // Filter data based on current filters (need this before early returns)
  const filteredData = useMemo(() => {
    if (data.length === 0) return [];
    
    // Handle multiple manufacturers
    let filteredByMake = data;
    if (filters.selectedManufacturers.length > 0) {
      filteredByMake = data.filter(item => 
        filters.selectedManufacturers.includes(item.make)
      );
    }
    
    // Apply year range filter
    const finalFiltered = filteredByMake.filter(item => 
      item.modelYear >= filters.yearRange[0] && 
      item.modelYear <= filters.yearRange[1]
    );
    
    return finalFiltered;
  }, [data, filters]);

  // Create filtered processor for filtered data (need this before early returns)
  const filteredProcessor = useMemo(() => {
    return new DataProcessor(filteredData);
  }, [filteredData]);

  // Generate comparison data when needed (need this before early returns)
  const comparisonData = useMemo(() => {
    if (filters.selectedManufacturers.length >= 2 && filters.showComparison && data.length > 0) {
      const allDataProcessor = new DataProcessor(data);
      return allDataProcessor.getComparisonData(filters.selectedManufacturers);
    }
    return null;
  }, [data, filters.selectedManufacturers, filters.showComparison]);

  // Generate single manufacturer analysis when needed
  const singleManufacturerData = useMemo(() => {
    if (filters.selectedManufacturers.length === 1 && data.length > 0) {
      const allDataProcessor = new DataProcessor(data);
      return allDataProcessor.getSingleManufacturerAnalysis(filters.selectedManufacturers[0]);
    }
    return null;
  }, [data, filters.selectedManufacturers]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data.csv");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvData = await response.text();
        const parsedData = DataProcessor.parseCSVData(csvData);

        setData(parsedData);
        setProcessor(new DataProcessor(parsedData));
        
        // Initialize filters with actual data ranges
        if (parsedData.length > 0) {
          const years = parsedData.map(d => d.modelYear).filter(y => y > 0);
          const minYear = Math.min(...years);
          const maxYear = Math.max(...years);
          
          setFilters({
            selectedManufacturers: [],
            yearRange: [minYear, maxYear],
            showComparison: false,
          });
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
          "Failed to load electric vehicle data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${className}`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">
            Loading electric vehicle data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${className}`}
      >
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Data Loading Error
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!processor || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${className}`}
      >
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Data Available
          </h2>
          <p className="text-gray-600">
            No electric vehicle data found to display.
          </p>
        </div>
      </div>
    );
  }

  const stats = filteredProcessor.getSummaryStats();
  const evTypeData = filteredProcessor.getEVTypeDistribution();
  const manufacturerData = filteredProcessor.getTopManufacturers(10);
  const countyData = filteredProcessor.getCountyDistribution(15);
  const timeSeriesData = filteredProcessor.getTimeSeriesData();
  const rangeData = filteredProcessor.getRangeDistribution();
  const cafvData = filteredProcessor.getCAFVEligibilityDistribution();

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Determine if we should show manufacturer chart and what title to use
  const shouldShowManufacturerChart = filters.selectedManufacturers.length !== 1;
  
  const getManufacturerChartTitle = () => {
    const selectedCount = filters.selectedManufacturers.length;
    
    if (selectedCount === 0) {
      return "Top 10 Manufacturers";
    } else if (selectedCount === 2) {
      return `Comparison: ${filters.selectedManufacturers.join(" vs ")}`;
    } else if (selectedCount === 3) {
      return `Market Share: ${filters.selectedManufacturers.slice(0, 2).join(", ")} & ${filters.selectedManufacturers[2]}`;
    } else if (selectedCount <= 5) {
      return `Selected Manufacturers (${selectedCount})`;
    } else {
      return `Multiple Manufacturers (${selectedCount})`;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Electric Vehicle Analytics Dashboard
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
            Comprehensive analysis of electric vehicle population data in
            Washington State
          </p>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          manufacturers={availableManufacturers}
          availableYears={availableYearRange}
          currentFilters={filters}
          onFilterChange={handleFilterChange}
          className="mb-6 sm:mb-8"
        />

        {/* Summary Statistics */}
        <MetricGrid stats={stats} />

        {/* Comparison Charts */}
        {comparisonData && filters.showComparison && (
          <div className="mb-6 sm:mb-8">
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Manufacturer Comparison Analysis
              </h2>
              <p className="text-sm sm:text-base text-gray-600 px-2 sm:px-0">
                Detailed comparison of {filters.selectedManufacturers.join(", ")} across multiple metrics
              </p>
            </div>
            <ComparisonCharts comparisonData={comparisonData} />
          </div>
        )}

        {/* Single Manufacturer Deep Dive */}
        {singleManufacturerData && filters.selectedManufacturers.length === 1 && (
          <div className="mb-6 sm:mb-8">
            <SingleManufacturerAnalysis data={singleManufacturerData} />
          </div>
        )}

        {/* Main Charts Grid */}
        {!filters.showComparison && filters.selectedManufacturers.length !== 1 && (
          <div className="space-y-6 sm:space-y-8">
            {/* First Row - EV Types and Manufacturers */}
            <div className={`grid grid-cols-1 ${shouldShowManufacturerChart ? 'lg:grid-cols-2' : 'lg:grid-cols-1 lg:max-w-2xl lg:mx-auto'} gap-6`}>
              <div className="w-full">
                <PieChart
                  data={evTypeData}
                  title="Electric Vehicle Types"
                />
              </div>
              {shouldShowManufacturerChart && (
                <div className="w-full">
                  <BarChart
                    data={manufacturerData}
                    title={getManufacturerChartTitle()}
                    color="#3B82F6"
                  />
                </div>
              )}
            </div>

            {/* Second Row - Geographic Distribution */}
            <div className="w-full">
              <BarChart
                data={countyData}
                title="Top 15 Counties by EV Registration"
                color="#10B981"
              />
            </div>

            {/* Third Row - Temporal and Range Analysis */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="w-full">
                <LineChart
                  data={timeSeriesData}
                  title="EV Registrations by Model Year"
                />
              </div>
              <div className="w-full">
                <Histogram
                  data={rangeData}
                  title="Electric Range Distribution"
                />
              </div>
            </div>

            {/* Fourth Row - CAFV Eligibility */}
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <PieChart
                  data={cafvData}
                  title="Clean Alternative Fuel Vehicle (CAFV) Eligibility Status"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Data source: Electric Vehicle Population Dataset | 
            {filteredData.length !== data.length ? (
              <>
                {" "}Showing {filteredData.length.toLocaleString()} of {data.length.toLocaleString()} records
                {filters.selectedManufacturers.length > 0 && (
                  filters.selectedManufacturers.length === 1 
                    ? ` for ${filters.selectedManufacturers[0]}`
                    : filters.selectedManufacturers.length <= 3
                    ? ` for ${filters.selectedManufacturers.join(", ")}`
                    : ` for ${filters.selectedManufacturers.length} manufacturers`
                )}
                {(filters.yearRange[0] !== availableYearRange[0] || filters.yearRange[1] !== availableYearRange[1]) &&
                  ` (${filters.yearRange[0]}-${filters.yearRange[1]})`}
              </>
            ) : (
              ` Total records: ${data.length.toLocaleString()}`
            )}
          </p>
        </div>
      </div>
    </div>
  );
};