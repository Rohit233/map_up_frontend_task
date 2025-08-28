"use client";

import React, { useEffect } from "react";
import { ModelDetailCard } from "./ModelDetailCard";

interface ModelPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  manufacturer: string;
  models: Array<{
    model: string;
    count: number;
    percentage: number;
    avgRange: number;
    avgYear: number;
    bevCount: number; 
    phevCount: number;
  }>;
}

export const ModelPortfolioModal: React.FC<ModelPortfolioModalProps> = ({
  isOpen,
  onClose,
  manufacturer,
  models,
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }


  // Calculate totals
  const totalVehicles = models.reduce((sum, model) => sum + model.count, 0);
  const totalBEV = models.reduce((sum, model) => sum + model.bevCount, 0);
  const totalPHEV = models.reduce((sum, model) => sum + model.phevCount, 0);
  const avgRange = Math.round(
    models.reduce((sum, model) => sum + (model.avgRange * model.count), 0) / totalVehicles
  );

  return (
    <div 
      className="modal-backdrop fixed inset-0 flex items-center justify-center p-4"
      style={{ 
        zIndex: 99999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)', // Safari support
      }}
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        style={{ 
          zIndex: 999999,
          transform: 'scale(1)',
          animation: 'modalFadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {manufacturer} Complete Model Portfolio
                </h2>
                <p className="text-blue-100 mt-1">
                  {models.length} models • {totalVehicles.toLocaleString()} total vehicles
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{models.length}</div>
                <div className="text-blue-200 text-sm">Models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{avgRange}</div>
                <div className="text-blue-200 text-sm">Avg Range</div>
              </div>
              <div 
                className="text-center cursor-help"
                title="Battery Electric Vehicle (BEV)"
              >
                <div className="text-2xl font-bold text-white">{totalBEV.toLocaleString()}</div>
                <div className="text-blue-200 text-sm">BEV Units</div>
              </div>
              <div 
                className="text-center cursor-help"
                title="Plug-in Hybrid Electric Vehicle (PHEV)"
              >
                <div className="text-2xl font-bold text-white">{totalPHEV.toLocaleString()}</div>
                <div className="text-blue-200 text-sm">PHEV Units</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models.map((model, index) => (
                <ModelDetailCard key={`${model.model}-${index}`} model={model} />
              ))}
            </div>
            
            {models.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg">No model data available</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing all {models.length} models for {manufacturer}
            </div>
            <button
              onClick={onClose}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
  );
};
