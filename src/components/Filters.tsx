"use client";

import React from "react";
import {
  FilterComponentProps,
  ManufacturerFilterProps,
  YearRangeFilterProps,
} from "@/dto";
import { MultiSelect } from "./MultiSelect";
import { ComparisonToggle } from "./ComparisonToggle";

export const ManufacturerFilter: React.FC<ManufacturerFilterProps> = ({
  manufacturers,
  selectedManufacturers,
  onManufacturersChange,
  className = "",
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        Select Manufacturers
      </label>
      <MultiSelect
        options={manufacturers}
        selectedValues={selectedManufacturers}
        onSelectionChange={onManufacturersChange}
        placeholder="All Manufacturers"
        maxDisplayCount={2}
      />
    </div>
  );
};

export const YearRangeFilter: React.FC<YearRangeFilterProps> = ({
  availableRange,
  selectedRange,
  onRangeChange,
  className = "",
}) => {
  const [minYear, maxYear] = availableRange;
  const [selectedMin, selectedMax] = selectedRange;

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, selectedMax);
    onRangeChange([newMin, selectedMax]);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, selectedMin);
    onRangeChange([selectedMin, newMax]);
  };

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        Model Year Range
      </label>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="text-xs text-gray-500">From</label>
          <input
            type="number"
            min={minYear}
            max={maxYear}
            value={selectedMin}
            onChange={(e) => handleMinChange(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="text-xs text-gray-500">To</label>
          <input
            type="number"
            min={minYear}
            max={maxYear}
            value={selectedMax}
            onChange={(e) => handleMaxChange(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
          />
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{minYear}</span>
          <span>{maxYear}</span>
        </div>
        <div className="mt-1 flex space-x-2">
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={selectedMin}
            onChange={(e) => handleMinChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
          />
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={selectedMax}
            onChange={(e) => handleMaxChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
          />
        </div>
        <div className="mt-1 text-xs text-center text-gray-600">
          Selected: {selectedMin} - {selectedMax}
        </div>
      </div>
    </div>
  );
};

export const FilterPanel: React.FC<FilterComponentProps> = ({
  manufacturers,
  availableYears,
  currentFilters,
  onFilterChange,
  className = "",
}) => {
  const handleManufacturersChange = (manufacturers: string[]) => {
    onFilterChange({
      ...currentFilters,
      selectedManufacturers: manufacturers,
    });
  };

  const handleYearRangeChange = (yearRange: [number, number]) => {
    onFilterChange({
      ...currentFilters,
      yearRange,
    });
  };

  const handleComparisonToggle = (showComparison: boolean) => {
    onFilterChange({
      ...currentFilters,
      showComparison,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      selectedManufacturers: [],
      yearRange: availableYears,
      showComparison: false,
    });
  };

  const hasActiveFilters =
    currentFilters.selectedManufacturers.length > 0 ||
    currentFilters.yearRange[0] !== availableYears[0] ||
    currentFilters.yearRange[1] !== availableYears[1] ||
    currentFilters.showComparison;

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ManufacturerFilter
          manufacturers={manufacturers}
          selectedManufacturers={currentFilters.selectedManufacturers}
          onManufacturersChange={handleManufacturersChange}
        />

        <YearRangeFilter
          availableRange={availableYears}
          selectedRange={currentFilters.yearRange}
          onRangeChange={handleYearRangeChange}
        />
      </div>

      {/* Comparison Toggle */}
      {currentFilters.selectedManufacturers.length >= 2 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <ComparisonToggle
            showComparison={currentFilters.showComparison}
            onToggleChange={handleComparisonToggle}
            disabled={currentFilters.selectedManufacturers.length < 2}
          />
        </div>
      )}

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {currentFilters.selectedManufacturers.map((manufacturer) => (
              <span key={manufacturer} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                {manufacturer}
                <button
                  onClick={() => handleManufacturersChange(
                    currentFilters.selectedManufacturers.filter(m => m !== manufacturer)
                  )}
                  className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  ×
                </button>
              </span>
            ))}
            {(currentFilters.yearRange[0] !== availableYears[0] ||
              currentFilters.yearRange[1] !== availableYears[1]) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                {currentFilters.yearRange[0]} - {currentFilters.yearRange[1]}
                <button
                  onClick={() => handleYearRangeChange(availableYears)}
                  className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
