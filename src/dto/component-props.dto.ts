import React from 'react';
import { SummaryStats } from './ev-data.dto';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export interface MetricGridProps {
  stats: SummaryStats;
}

export interface DashboardProps {
  className?: string;
}
