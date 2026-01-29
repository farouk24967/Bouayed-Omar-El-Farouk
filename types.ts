
export type Specialty = string;

export interface KpiData {
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number; // Optional second metric
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  lastVisit: string;
  condition: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: 'Confirmé' | 'En attente' | 'Annulé';
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  patientName: string;
  method: 'Espèces' | 'Carte' | 'Chèque' | 'Virement';
  note?: string;
}

export interface DashboardData {
  clinicName: string;
  specialty: string;
  kpis: KpiData[];
  monthlyPatients: ChartDataPoint[];
  revenueDistribution: ChartDataPoint[];
  recommendations: string[];
  recentPatients: Patient[];
  upcomingAppointments: Appointment[];
}

export interface FormData {
  clinicName: string;
  primaryColor: string;
  secondaryColor: string;
  specialty: string;
  category: string;
  logo: string | null;
}
