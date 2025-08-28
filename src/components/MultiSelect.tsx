"use client";

import React, { useState, useRef, useEffect } from "react";

interface MultiSelectProps {
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  maxDisplayCount?: number;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Select options...",
  maxDisplayCount = 2,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (option: string) => {
    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter(value => value !== option)
      : [...selectedValues, option];
    
    onSelectionChange(newSelectedValues);
  };

  const handleSelectAll = () => {
    onSelectionChange(filteredOptions);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    
    if (selectedValues.length === 1) {
      return selectedValues[0];
    }
    
    if (selectedValues.length <= maxDisplayCount) {
      return selectedValues.join(", ");
    }
    
    return `${selectedValues.slice(0, maxDisplayCount).join(", ")} +${selectedValues.length - maxDisplayCount} more`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`flex-1 truncate ${selectedValues.length === 0 ? 'text-gray-500' : ''}`}>
          {getDisplayText()}
        </span>
        <div className="flex items-center space-x-1">
          {selectedValues.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {selectedValues.length}
            </span>
          )}
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search manufacturers..."
              className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="p-2 border-b border-gray-200 flex justify-between">
            <button
              onClick={handleSelectAll}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              disabled={filteredOptions.length === 0}
            >
              Select All ({filteredOptions.length})
            </button>
            <button
              onClick={handleClearAll}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
              disabled={selectedValues.length === 0}
            >
              Clear All
            </button>
          </div>

          {/* Options List */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">No manufacturers found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                    selectedValues.includes(option) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleToggleOption(option)}
                >
                  <span className="text-sm text-gray-900 flex-1">{option}</span>
                  {selectedValues.includes(option) && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Selection Summary */}
          {selectedValues.length > 0 && (
            <div className="p-2 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-1">
                {selectedValues.slice(0, 4).map((value) => (
                  <span
                    key={value}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {value}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleOption(value);
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedValues.length > 4 && (
                  <span className="text-xs text-gray-600">
                    +{selectedValues.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
