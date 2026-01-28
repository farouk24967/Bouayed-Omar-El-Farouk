export enum Specialty {
  GENERALISTE = 'Généraliste',
  DENTISTE = 'Dentiste',
  PEDIATRE = 'Pédiatre',
  MULTI = 'Multispecialité'
}

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
  specialty: Specialty;
  logo: string | null;
}
