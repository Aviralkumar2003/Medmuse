import api from './api';

export interface Report {
  id: number;
  weekStartDate: string;
  weekEndDate: string;
  generatedAt: string;
  healthSummary: string;
  riskAreas: string;
  recommendations: string;
  hasPdf: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface GetReportsParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface CustomReportParams {
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
}

export const reportService = {
  // Generate weekly report
  generateWeeklyReport: async (): Promise<Report> => {
    const response = await api.post('/api/reports/generate');
    return response.data;
  },

  // Generate custom date range report
  generateCustomReport: async (params: CustomReportParams): Promise<Report> => {
    const response = await api.post('/api/reports/generate/custom', null, { params });
    return response.data;
  },

  // Get user reports
  getUserReports: async (): Promise<Report[]> => {
    const response = await api.get('/api/reports/my');
    return response.data;
  },

  // Get user reports (paginated)
  getUserReportsPaginated: async (params: GetReportsParams = {}): Promise<PaginatedResponse<Report>> => {
    const response = await api.get('/api/reports/my/paginated', { params });
    return response.data;
  },

  // Get specific report
  getReport: async (reportId: number): Promise<Report> => {
    const response = await api.get(`/api/reports/${reportId}`);
    return response.data;
  },

  // Download report PDF
  downloadReportPdf: async (reportId: number): Promise<Blob> => {
    const response = await api.get(`/api/reports/${reportId}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Delete report
  deleteReport: async (reportId: number): Promise<void> => {
    await api.delete(`/api/reports/${reportId}`);
  }
};