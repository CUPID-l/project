import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export interface SoilParameters {
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  temperature: number;
  humidity: number;
  cropType: string;
}

export interface FertilizerRecommendation {
  fertilizer: string;
  applicationRate: string;
  additionalSuggestions: string[];
  confidence: number;
  timestamp: string;
}

export interface ReportResponse {
  report: string;
}

export interface ErrorResponse {
  detail: string;
}

// Add token to requests
const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getFertilizerRecommendation = async (
  params: SoilParameters
): Promise<FertilizerRecommendation> => {
  try {
    const response = await axios.post<FertilizerRecommendation>(
      `${BACKEND_URL}/api/predict`,
      params,
      {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorResponse = error.response?.data as ErrorResponse;
      throw new Error(errorResponse?.detail || 'Failed to get fertilizer recommendation');
    }
    throw error;
  }
};

export const generateReport = async (
  params: SoilParameters
): Promise<ReportResponse> => {
  try {
    const response = await axios.post<ReportResponse>(
      `${BACKEND_URL}/api/generate-report`,
      params,
      {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorResponse = error.response?.data as ErrorResponse;
      throw new Error(errorResponse?.detail || 'Failed to generate report');
    }
    throw error;
  }
}; 