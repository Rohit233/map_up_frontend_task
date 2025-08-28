import { ChartData, TimeSeriesData } from './chart-data.dto';

export interface ChartProps {
  width?: number;
  height?: number;
  className?: string;
}

export interface PieChartProps extends ChartProps {
  data: ChartData[];
  title: string;
}

export interface BarChartProps extends ChartProps {
  data: ChartData[];
  title: string;
  color?: string;
}

export interface LineChartProps extends ChartProps {
  data: TimeSeriesData[];
  title: string;
}

export interface HistogramProps extends ChartProps {
  data: ChartData[];
  title: string;
}
