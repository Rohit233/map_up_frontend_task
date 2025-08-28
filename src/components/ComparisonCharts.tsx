"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ComparisonChartsProps } from "@/dto";

interface GroupedBarChartProps {
  data: Array<{ manufacturer: string; [key: string]: number | string }>;
  title: string;
  width?: number;
  height?: number;
  keys: string[];
  colors: string[];
  yAxisLabel?: string;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
  data,
  title,
  width = 500,
  height = 350,
  keys,
  colors,
  yAxisLabel,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 50, right: 80, bottom: 80, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("class", "text-lg font-semibold fill-gray-800")
      .text(title);

    const x0 = d3.scaleBand()
      .domain(data.map(d => d.manufacturer as string))
      .rangeRound([0, innerWidth])
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .domain(keys)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(keys, key => d[key] as number) || 0) || 0])
      .nice()
      .range([innerHeight, 0]);

    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(colors);

    // Add bars
    g.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", d => `translate(${x0(d.manufacturer as string)}, 0)`)
      .selectAll("rect")
      .data(d => keys.map(key => ({ key, value: d[key] as number, manufacturer: d.manufacturer })))
      .join("rect")
      .attr("x", d => x1(d.key) || 0)
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => innerHeight - y(d.value))
      .attr("fill", d => color(d.key) as string)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "14px")
          .style("pointer-events", "none")
          .style("z-index", "1000");
        
        tooltip.html(`${d.manufacturer}<br/>${d.key}: ${d.value.toLocaleString()}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        d3.selectAll(".tooltip").remove();
      });

    // Add x-axis
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .attr("class", "text-sm fill-gray-600");

    // Add y-axis
    g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("class", "text-sm fill-gray-600");

    // Add y-axis label
    if (yAxisLabel) {
      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (innerHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("class", "text-sm fill-gray-600")
        .text(yAxisLabel);
    }

    // Add legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - margin.right + 10}, ${margin.top})`);

    const legendItems = legend.selectAll(".legend-item")
      .data(keys)
      .enter().append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", d => color(d) as string);

    legendItems.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .attr("class", "text-sm fill-gray-700")
      .text(d => d);

  }, [data, width, height, title, keys, colors, yAxisLabel]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

interface MultiLineChartProps {
  data: Array<{ manufacturer: string; data: Array<{ year: number; count: number }> }>;
  title: string;
  width?: number;
  height?: number;
}

const MultiLineChart: React.FC<MultiLineChartProps> = ({
  data,
  title,
  width = 600,
  height = 350,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 50, right: 100, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("class", "text-lg font-semibold fill-gray-800")
      .text(title);

    // Get all years and max count
    const allYears = Array.from(new Set(data.flatMap(d => d.data.map(item => item.year)))).sort();
    const maxCount = d3.max(data.flatMap(d => d.data.map(item => item.count))) || 0;

    const x = d3.scaleLinear()
      .domain(d3.extent(allYears) as [number, number])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, maxCount])
      .range([innerHeight, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const line = d3.line<{ year: number; count: number }>()
      .x(d => x(d.year))
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX);

    // Add lines
    data.forEach((manufacturerData, i) => {
      g.append("path")
        .datum(manufacturerData.data)
        .attr("fill", "none")
        .attr("stroke", color(i.toString()) as string)
        .attr("stroke-width", 2)
        .attr("d", line);

      // Add dots
      g.selectAll(`.dots-${i}`)
        .data(manufacturerData.data)
        .enter().append("circle")
        .attr("class", `dots-${i}`)
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.count))
        .attr("r", 4)
        .attr("fill", color(i.toString()) as string)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          d3.select(this).attr("r", 6);
          
          const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "rgba(0, 0, 0, 0.8)")
            .style("color", "white")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("font-size", "14px")
            .style("pointer-events", "none")
            .style("z-index", "1000");
          
          tooltip.html(`${manufacturerData.manufacturer}<br/>${d.year}: ${d.count.toLocaleString()}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
          d3.select(this).attr("r", 4);
          d3.selectAll(".tooltip").remove();
        });
    });

    // Add x-axis
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .selectAll("text")
      .attr("class", "text-sm fill-gray-600");

    // Add y-axis
    g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("class", "text-sm fill-gray-600");

    // Add legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - margin.right + 10}, ${margin.top})`);

    const legendItems = legend.selectAll(".legend-item")
      .data(data)
      .enter().append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d, i) => color(i.toString()) as string);

    legendItems.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .attr("class", "text-sm fill-gray-700")
      .text(d => d.manufacturer);

  }, [data, width, height, title]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export const ComparisonCharts: React.FC<ComparisonChartsProps> = ({
  comparisonData,
  className = "",
}) => {
  const { manufacturers } = comparisonData;

  if (manufacturers.length < 2) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-500 text-lg">
          Select at least 2 manufacturers to see comparison charts
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Electric Range Comparison */}
      <GroupedBarChart
        data={comparisonData.rangeComparison}
        title="Average Electric Range Comparison"
        keys={["avgRange"]}
        colors={["#3B82F6"]}
        yAxisLabel="Range (miles)"
        width={600}
        height={350}
      />

      {/* EV Type Distribution */}
      <GroupedBarChart
        data={comparisonData.typeComparison}
        title="EV Type Distribution by Manufacturer"
        keys={["bev", "phev"]}
        colors={["#10B981", "#F59E0B"]}
        yAxisLabel="Number of Vehicles"
        width={700}
        height={350}
      />

      {/* CAFV Eligibility */}
      <GroupedBarChart
        data={comparisonData.eligibilityComparison}
        title="Clean Alternative Fuel Vehicle Eligibility"
        keys={["eligible", "notEligible"]}
        colors={["#10B981", "#EF4444"]}
        yAxisLabel="Number of Vehicles"
        width={700}
        height={350}
      />

      {/* Model Diversity */}
      <GroupedBarChart
        data={comparisonData.modelsComparison}
        title="Model Portfolio Diversity"
        keys={["uniqueModels"]}
        colors={["#8B5CF6"]}
        yAxisLabel="Number of Unique Models"
        width={600}
        height={350}
      />

      {/* Yearly Trends */}
      <MultiLineChart
        data={comparisonData.trendsComparison}
        title="Registration Trends Over Time"
        width={800}
        height={400}
      />

      {/* Geographic Presence */}
      <GroupedBarChart
        data={comparisonData.geoComparison}
        title="Top County Registrations by Manufacturer"
        keys={["count"]}
        colors={["#06B6D4"]}
        yAxisLabel="Number of Vehicles"
        width={700}
        height={350}
      />
    </div>
  );
};
