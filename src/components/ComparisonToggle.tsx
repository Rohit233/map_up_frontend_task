"use client";

import React from "react";
import { ComparisonToggleProps } from "@/dto";

export const ComparisonToggle: React.FC<ComparisonToggleProps> = ({
  showComparison,
  onToggleChange,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm font-medium text-gray-700">
        Comparison View
      </span>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          showComparison
            ? "bg-blue-600"
            : "bg-gray-200"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => !disabled && onToggleChange(!showComparison)}
        disabled={disabled}
        aria-label="Toggle comparison view"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            showComparison ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-xs text-gray-500">
        {disabled 
          ? "Select multiple manufacturers to compare"
          : showComparison 
          ? "Showing comparison charts"
          : "Showing standard charts"
        }
      </span>
    </div>
  );
};
