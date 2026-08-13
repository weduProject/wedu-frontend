export interface DDayData {
  ddayId: number;
  weddingDate: string; // "YYYY-MM-DD"
  targetAt: string;
  daysRemaining: number;
}

export interface DDayApiResponse {
  success: boolean;
  data: DDayData | null;
  error?: {
    code: string;
    message: string;
  };
}