import React, { lazy, Suspense, ComponentType } from 'react';

const BarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })));
const PieChart = lazy(() => import('recharts').then(module => ({ default: module.PieChart })));
const LineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })));
const ComposedChart = lazy(() => import('recharts').then(module => ({ default: module.ComposedChart })));

const ChartComponents = lazy(() => import('recharts').then(module => ({
  default: {
    Bar: module.Bar,
    Pie: module.Pie,
    Line: module.Line,
    XAxis: module.XAxis,
    YAxis: module.YAxis,
    CartesianGrid: module.CartesianGrid,
    Tooltip: module.Tooltip,
    Legend: module.Legend,
    ResponsiveContainer: module.ResponsiveContainer,
    Cell: module.Cell,
    LabelList: module.LabelList
  }
})));

const ChartLoader: React.FC = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

interface ChartProps {
  [key: string]: any;
}

export function LazyBarChart(props: ChartProps): JSX.Element {
  return (
    <Suspense fallback={<ChartLoader />}>
      <BarChart {...props} />
    </Suspense>
  );
}

export function LazyPieChart(props: ChartProps): JSX.Element {
  return (
    <Suspense fallback={<ChartLoader />}>
      <PieChart {...props} />
    </Suspense>
  );
}

export function LazyLineChart(props: ChartProps): JSX.Element {
  return (
    <Suspense fallback={<ChartLoader />}>
      <LineChart {...props} />
    </Suspense>
  );
}

export function LazyComposedChart(props: ChartProps): JSX.Element {
  return (
    <Suspense fallback={<ChartLoader />}>
      <ComposedChart {...props} />
    </Suspense>
  );
}

interface LazyChartComponentsProps {
  children: React.ReactNode;
}

export function LazyChartComponents({ children }: LazyChartComponentsProps): JSX.Element {
  return (
    <Suspense fallback={<ChartLoader />}>
      <ChartComponents>
        {children}
      </ChartComponents>
    </Suspense>
  );
}