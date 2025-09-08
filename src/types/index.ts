// Types pour les données de l'application
export interface Department {
  hoursTarget: number;
  hoursSold: number;
  progress: number;
  previousDayBilling: number;
  revenueTarget: number;
  revenue: number;
  revenueProgress: number;
  revenuePerHour: number;
  target: number;
  actual: number;
}

export interface SalesItem {
  target: number;
  actual: number;
  delta: number;
}

export interface CountItem {
  count: number;
}

export interface DepartmentSales {
  tires: SalesItem;
  shockAbsorbers: SalesItem;
  wipers: SalesItem;
  brakePads: SalesItem;
  batteries: SalesItem;
  windshields: SalesItem;
  oilFilters: CountItem;
  additives: CountItem;
  discs: CountItem;
  acSterilization: CountItem;
}

export interface VideoCheckData {
  target: number;
  entries: number;
  completed: number;
  identifiedRevenue: number;
  actualRevenue: number;
  completionRate: number;
  theoreticalProgress: number;
  revenuePerVideo: number;
}

export interface MockData {
  departments: {
    mechanical: Department;
    quickService: Department;
    bodywork: Department;
  };
  videoCheck: VideoCheckData;
  sales: {
    mechanical: DepartmentSales;
    quickService: DepartmentSales;
    bodywork: DepartmentSales;
  };
}

export interface ChartData {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
}

export interface EmployeeData {
  id: number;
  name: string;
  service: string;
  jobType: string;
  target: number;
  daysPresent: number;
  billingPotential: number;
  billedHours: number;
  hasOvertime: boolean;
  isEditingName: boolean;
  billingHistory: BillingHistoryEntry[];
}

export interface BillingHistoryEntry {
  date: Date;
  hours: number;
  day: number;
}

export interface TicketData {
  id: number;
  subject: string;
  type: string;
  priority: string;
  status: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthSession {
  user: User;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

export interface BudgetData {
  totalHours: number;
  hecHours: number;
  revenue: number;
}

export interface PotentialData {
  total: { hours: number; updatedHours: number };
  mechanical: { hours: number; updatedHours: number };
  quickService: { hours: number; updatedHours: number };
  bodywork: { hours: number; updatedHours: number };
}

export interface TargetData {
  mechanical: {
    totalHours: number;
    hecHours: number;
    revenue: number;
    revenuePerHour: number;
  };
  quickService: {
    totalHours: number;
    hecHours: number;
    revenue: number;
    revenuePerHour: number;
  };
  bodywork: {
    totalHours: number;
    hecHours: number;
    revenue: number;
    revenuePerHour: number;
  };
}

export interface FamilyTargets {
  mechanical: Record<string, number>;
  quickService: Record<string, number>;
  bodywork: Record<string, number>;
}

export interface ProductivityTarget {
  service: string;
  target: number;
}

export type ViewType = 'canet' | 'hours' | 'capr' | 'pr';
export type PeriodType = 'monthly' | 'yearly';
export type ChartType = 'bar' | 'monthly';
export type ActiveTab = 'overview' | 'targets' | 'comparatifs' | 'progress' | 'financial';
export type SiteCode = 'RO' | 'EU' | 'MTD' | 'ST';