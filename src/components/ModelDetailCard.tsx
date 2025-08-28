"use client";

import React from "react";
import { ModelDetailCardProps } from "@/dto";

export const ModelDetailCard: React.FC<ModelDetailCardProps> = ({ model, className = "" }) => {
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow ${className}`}>
      <h4 className="text-lg font-semibold text-gray-900 mb-3">{model.model}</h4>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-600">Total Units:</span>
          <span className="font-medium text-gray-900 ml-2">{model.count.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-gray-600">Market Share:</span>
          <span className="font-medium text-blue-600 ml-2">{model.percentage.toFixed(1)}%</span>
        </div>
        <div>
          <span className="text-gray-600">Avg Range:</span>
          <span className="font-medium text-green-600 ml-2">{model.avgRange} mi</span>
        </div>
        <div>
          <span className="text-gray-600">Avg Year:</span>
          <span className="font-medium text-purple-600 ml-2">{model.avgYear}</span>
        </div>
      </div>
      <div className="mt-3 flex space-x-4 text-xs">
        <span 
          className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 cursor-help transition-all hover:bg-green-200 hover:scale-105"
          title="Battery Electric Vehicle (BEV)"
        >
          BEV: {model.bevCount}
        </span>
        <span 
          className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-800 cursor-help transition-all hover:bg-orange-200 hover:scale-105"
          title="Plug-in Hybrid Electric Vehicle (PHEV)"
        >
          PHEV: {model.phevCount}
        </span>
      </div>
    </div>
  );
};
