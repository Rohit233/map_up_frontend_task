'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { ChartData, PieChartProps, BarChartProps, LineChartProps, HistogramProps } from '@/dto';

// Custom hook for responsive chart sizing
const useChartDimensions = (aspectRatio: number = 1) => {
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const screenWidth = window.innerWidth;
      
      // Responsive width calculation based on screen size
      let width: number;
      if (screenWidth < 640) { // mobile
        width = Math.max(280, Math.min(containerWidth - 16, 400));
      } else if (screenWidth < 1024) { // tablet
        width = Math.max(350, Math.min(containerWidth - 24, 600));
      } else { // desktop
        width = Math.max(400, Math.min(containerWidth - 32, 800));
      }
      
      const height = width / aspectRatio;
      setDimensions({ width, height });
    }
  }, [aspectRatio]);

  useEffect(() => {
    updateDimensions();
    const handleResize = () => updateDimensions();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateDimensions]);

  return { dimensions, containerRef };
};

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  title, 
  width, 
  height, 
  className = '' 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { dimensions, containerRef } = useChartDimensions(1); // Square aspect ratio for pie charts
  
  // Use responsive dimensions or fallback to props
  const chartWidth = width || dimensions.width;
  const chartHeight = height || dimensions.height;

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    const g = svg.append('g')
      .attr('transform', `translate(${chartWidth / 2}, ${chartHeight / 2})`);

    // Add title
    svg.append('text')
      .attr('x', chartWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-lg font-semibold fill-gray-800')
      .text(title);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie<ChartData>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<ChartData>>()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8);

    const outerArc = d3.arc<d3.PieArcDatum<ChartData>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i.toString()))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '14px')
          .style('pointer-events', 'none')
          .style('z-index', '1000');
        
        tooltip.html(`${d.data.label}: ${d.data.value} (${(d.data.percentage || 0).toFixed(1)}%)`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        d3.selectAll('.tooltip').remove();
      });

    // Add labels
    const polyline = g.selectAll('polyline')
      .data(pie(data))
      .enter().append('polyline')
      .attr('points', d => {
        const posA = arc.centroid(d);
        const posB = outerArc.centroid(d);
        const posC = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
        return [posA, posB, posC].map(p => p.join(',')).join(' ');
      })
      .attr('fill', 'none')
      .attr('stroke', '#666')
      .attr('stroke-width', 1);

    const labels = g.selectAll('.label')
      .data(pie(data))
      .enter().append('text')
      .attr('class', 'label')
      .attr('transform', d => {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr('text-anchor', d => {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? 'start' : 'end';
      })
      .attr('class', 'text-sm fill-gray-700')
      .text(d => d.data.label);

  }, [data, chartWidth, chartHeight, title]);

  return (
    <div ref={containerRef} className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <svg 
        ref={svgRef} 
        width={chartWidth} 
        height={chartHeight}
        style={{ maxWidth: '100%', height: 'auto' }}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  width, 
  height, 
  color = '#3B82F6',
  className = '' 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { dimensions, containerRef } = useChartDimensions(1.5); // 1.5:1 aspect ratio for bar charts
  
  // Use responsive dimensions or fallback to props
  const chartWidth = width || dimensions.width;
  const chartHeight = height || dimensions.height;

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 50, right: 30, bottom: 80, left: 60 };
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Add title
    svg.append('text')
      .attr('x', chartWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-lg font-semibold fill-gray-800')
      .text(title);

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([innerHeight, 0]);

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) || 0)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', color)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '14px')
          .style('pointer-events', 'none')
          .style('z-index', '1000');
        
        tooltip.html(`${d.label}: ${d.value.toLocaleString()}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        d3.selectAll('.tooltip').remove();
      });

    // Add x-axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')
      .attr('class', 'text-sm fill-gray-600');

    // Add y-axis
    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .attr('class', 'text-sm fill-gray-600');

  }, [data, chartWidth, chartHeight, title, color]);

  return (
    <div ref={containerRef} className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <svg 
        ref={svgRef} 
        width={chartWidth} 
        height={chartHeight}
        style={{ maxWidth: '100%', height: 'auto' }}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  title, 
  width, 
  height, 
  className = '' 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { dimensions, containerRef } = useChartDimensions(2); // 2:1 aspect ratio for line charts
  
  // Use responsive dimensions or fallback to props
  const chartWidth = width || dimensions.width;
  const chartHeight = height || dimensions.height;

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 50, right: 30, bottom: 50, left: 60 };
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Add title
    svg.append('text')
      .attr('x', chartWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-lg font-semibold fill-gray-800')
      .text(title);

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year) as [number, number])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 0])
      .range([innerHeight, 0]);

    const line = d3.line<{ year: number; count: number }>()
      .x(d => x(d.year))
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX);

    // Add line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add dots
    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.year))
      .attr('cy', d => y(d.count))
      .attr('r', 4)
      .attr('fill', '#3B82F6')
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 6);
        
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '14px')
          .style('pointer-events', 'none')
          .style('z-index', '1000');
        
        tooltip.html(`${d.year}: ${d.count.toLocaleString()} vehicles`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 4);
        d3.selectAll('.tooltip').remove();
      });

    // Add x-axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')))
      .selectAll('text')
      .attr('class', 'text-sm fill-gray-600');

    // Add y-axis
    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .attr('class', 'text-sm fill-gray-600');

  }, [data, chartWidth, chartHeight, title]);

  return (
    <div ref={containerRef} className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <svg 
        ref={svgRef} 
        width={chartWidth} 
        height={chartHeight}
        style={{ maxWidth: '100%', height: 'auto' }}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export const Histogram: React.FC<HistogramProps> = ({ 
  data, 
  title, 
  width, 
  height, 
  className = '' 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { dimensions, containerRef } = useChartDimensions(1.5); // 1.5:1 aspect ratio for histogram
  
  // Use responsive dimensions or fallback to props
  const chartWidth = width || dimensions.width;
  const chartHeight = height || dimensions.height;

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 50, right: 30, bottom: 80, left: 60 };
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Add title
    svg.append('text')
      .attr('x', chartWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-lg font-semibold fill-gray-800')
      .text(title);

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([innerHeight, 0]);

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) || 0)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', '#10B981')
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '14px')
          .style('pointer-events', 'none')
          .style('z-index', '1000');
        
        tooltip.html(`Range: ${d.label} miles<br/>Count: ${d.value}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        d3.selectAll('.tooltip').remove();
      });

    // Add x-axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')
      .attr('class', 'text-sm fill-gray-600');

    // Add y-axis
    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .attr('class', 'text-sm fill-gray-600');

  }, [data, chartWidth, chartHeight, title]);

  return (
    <div ref={containerRef} className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <svg 
        ref={svgRef} 
        width={chartWidth} 
        height={chartHeight}
        style={{ maxWidth: '100%', height: 'auto' }}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};
