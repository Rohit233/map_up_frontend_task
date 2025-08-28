'use client';

import React from 'react';
import { StatsCardProps, MetricGridProps } from '@/dto';

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-blue-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export const MetricGrid: React.FC<MetricGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 mt-5">
      <StatsCard
        title="Total Vehicles"
        value={stats.totalVehicles}
        subtitle="Electric vehicles registered"
        icon={
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
          </svg>
        }
      />
      <StatsCard
        title="Average Range"
        value={stats.avgRange}
        subtitle="Miles per charge"
        icon={
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
          </svg>
        }
      />
      <StatsCard
        title="Manufacturers"
        value={stats.uniqueManufacturers}
        subtitle="Different brands"
        icon={
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zM10.5 2A1.5 1.5 0 009 3.5v11.8a3.001 3.001 0 102 0V3.5A1.5 1.5 0 0010.5 2z" clipRule="evenodd"/>
          </svg>
        }
      />
      <StatsCard
        title="Models"
        value={stats.uniqueModels}
        subtitle="Different vehicle models"
        icon={
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        }
      />
      <StatsCard
        title="Year Range"
        value={`${stats.yearRange[0]}-${stats.yearRange[1]}`}
        subtitle="Model years covered"
        icon={
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
          </svg>
        }
      />
    </div>
  );
};
