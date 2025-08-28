export interface FilterState {
  selectedManufacturers: string[];
  yearRange: [number, number];
  showComparison: boolean;
}

export interface FilterComponentProps {
  manufacturers: string[];
  availableYears: [number, number];
  currentFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export interface ManufacturerFilterProps {
  manufacturers: string[];
  selectedManufacturers: string[];
  onManufacturersChange: (manufacturers: string[]) => void;
  className?: string;
}

export interface YearRangeFilterProps {
  availableRange: [number, number];
  selectedRange: [number, number];
  onRangeChange: (range: [number, number]) => void;
  className?: string;
}
