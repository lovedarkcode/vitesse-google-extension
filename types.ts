
export interface PerformanceMetrics {
  ttfb: number;
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  loadTime: number;
  timestamp: number;
}

export interface WaterfallSegment {
  name: string;
  duration: number;
  color: string;
}

export interface Diagnosis {
  status: 'Healthy' | 'Warning' | 'Critical';
  score: number;
  summary: string;
  recruiterInsight: string;
  technicalDebt: string;
  potentialCauses: string[];
  waterfall: WaterfallSegment[];
  recommendations: {
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
    effort: 'Low' | 'Medium' | 'High';
  }[];
}

export interface AppState {
  currentMetrics: PerformanceMetrics | null;
  history: PerformanceMetrics[];
  diagnosis: Diagnosis | null;
  isLoading: boolean;
}
