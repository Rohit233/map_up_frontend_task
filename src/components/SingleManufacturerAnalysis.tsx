"use client";

import React, { useState } from "react";
import { SingleManufacturerAnalysisProps } from "@/dto";
import { PieChart, BarChart, LineChart, Histogram } from "./Chart";
import { ModelPortfolioModal } from "./ModelPortfolioModal";
import { ModelDetailCard } from "./ModelDetailCard";

export const SingleManufacturerAnalysis: React.FC<SingleManufacturerAnalysisProps> = ({
  data,
  className = "",
}) => {
  const { manufacturer, totalVehicles, summaryStats } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{manufacturer} Deep Dive</h2>
            <p className="text-blue-100 text-lg">
              Comprehensive analysis of {totalVehicles.toLocaleString()} registered vehicles
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Most Popular</div>
            <div className="text-2xl font-bold">{summaryStats.mostPopularModel}</div>
            <div className="text-sm text-blue-200 mt-2">Peak Year: {summaryStats.peakRegistrationYear}</div>
          </div>
        </div>
      </div>

      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-600">{data.modelBreakdown.length}</div>
          <div className="text-gray-600 text-sm">Different Models</div>
          <div className="text-xs text-gray-500 mt-1">Product Portfolio</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{data.rangeStats.avgRange}</div>
          <div className="text-gray-600 text-sm">Avg Range (miles)</div>
          <div className="text-xs text-gray-500 mt-1">Max: {data.rangeStats.maxRange} mi</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <div className="text-2xl font-bold text-purple-600">{summaryStats.avgModelYear}</div>
          <div className="text-gray-600 text-sm">Avg Model Year</div>
          <div className="text-xs text-gray-500 mt-1">Range: {summaryStats.oldestModelYear}-{summaryStats.newestModelYear}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
          <div className="text-2xl font-bold text-orange-600">{data.countyDistribution.length}</div>
          <div className="text-gray-600 text-sm">Counties Served</div>
          <div className="text-xs text-gray-500 mt-1">Top: {summaryStats.mostPopularCounty}</div>
        </div>
      </div>

      {/* Model Portfolio Section */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Model Portfolio Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {data.modelBreakdown.slice(0, 6).map((model) => (
            <ModelDetailCard key={model.model} model={model} />
          ))}
        </div>
        {data.modelBreakdown.length > 6 && (
          <div className="text-center">
            <button
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              View All {data.modelBreakdown.length} Models
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="space-y-8">
        {/* First Row - Model Distribution and EV Types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart
            data={data.modelBreakdown.slice(0, 10).map(m => ({
              label: m.model,
              value: m.count
            }))}
            title={`Top Models by Registration Volume`}
            color="#3B82F6"
            width={500}
            height={400}
          />
          <PieChart
            data={[
              { label: "Battery Electric (BEV)", value: data.evTypeBreakdown.bev.count, percentage: data.evTypeBreakdown.bev.percentage },
              { label: "Plug-in Hybrid (PHEV)", value: data.evTypeBreakdown.phev.count, percentage: data.evTypeBreakdown.phev.percentage }
            ]}
            title={`${manufacturer} EV Technology Mix`}
            width={400}
            height={400}
          />
        </div>

        {/* Second Row - Geographic Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart
            data={data.countyDistribution.slice(0, 10).map(c => ({
              label: c.county,
              value: c.count
            }))}
            title="Top Counties by Registration"
            color="#10B981"
            width={500}
            height={400}
          />
          <BarChart
            data={data.cityDistribution.slice(0, 10).map(c => ({
              label: c.city,
              value: c.count
            }))}
            title="Top Cities by Registration"
            color="#F59E0B"
            width={500}
            height={400}
          />
        </div>

        {/* Third Row - Time Analysis and Range Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChart
            data={data.yearlyRegistrations}
            title={`${manufacturer} Registration Trends`}
            width={500}
            height={400}
          />
          <Histogram
            data={data.rangeStats.rangeDistribution.map(r => ({
              label: r.range,
              value: r.count
            }))}
            title={`${manufacturer} Range Distribution`}
            width={500}
            height={400}
          />
        </div>

        {/* Fourth Row - Utility and CAFV Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart
            data={data.electricUtilities.slice(0, 8).map(u => ({
              label: u.utility.length > 30 ? u.utility.substring(0, 30) + "..." : u.utility,
              value: u.count
            }))}
            title="Electric Utility Coverage"
            color="#8B5CF6"
            width={500}
            height={400}
          />
          <PieChart
            data={data.cafvBreakdown.map(c => ({
              label: c.status,
              value: c.count,
              percentage: c.percentage
            }))}
            title="CAFV Eligibility Status"
            width={400}
            height={400}
          />
        </div>

        {/* Fifth Row - Legislative Districts */}
        <div className="grid grid-cols-1 gap-6">
          <BarChart
            data={data.legislativeDistricts.slice(0, 15).map(d => ({
              label: `District ${d.district}`,
              value: d.count
            }))}
            title="Legislative District Distribution"
            color="#06B6D4"
            width={800}
            height={400}
          />
        </div>
      </div>

      {/* Additional Insights Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Market Position</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Strongest presence in <span className="font-medium text-gray-800">{summaryStats.mostPopularCounty}</span> county</li>
              <li>• Most popular model: <span className="font-medium text-gray-800">{summaryStats.mostPopularModel}</span></li>
              <li>• Portfolio includes <span className="font-medium text-gray-800">{data.modelBreakdown.length}</span> different models</li>
              <li>• Average vehicle range: <span className="font-medium text-gray-800">{data.rangeStats.avgRange}</span> miles</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Technology Focus</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• <span className="font-medium text-gray-800">{data.evTypeBreakdown.bev.percentage.toFixed(1)}%</span> Battery Electric Vehicles</li>
              <li>• <span className="font-medium text-gray-800">{data.evTypeBreakdown.phev.percentage.toFixed(1)}%</span> Plug-in Hybrid Vehicles</li>
              <li>• Peak registration year: <span className="font-medium text-gray-800">{summaryStats.peakRegistrationYear}</span></li>
              <li>• Serves <span className="font-medium text-gray-800">{data.countyDistribution.length}</span> counties in Washington</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Model Portfolio Modal */}
      <ModelPortfolioModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        manufacturer={manufacturer}
        models={data.modelBreakdown}
      />
    </div>
  );
};
