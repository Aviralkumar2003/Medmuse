import api from './api';

export interface Report {
  id: number;
  weekStartDate: string;
  weekEndDate: string;
  generatedAt: string;
  healthSummary: string;
  riskAreas: string;
  recommendations: string;
  hasPdf: boolean;      // frontend-friendly flag
  pdfPath?: string;     // keep original path too (optional)
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
  endDate: string;   // YYYY-MM-DD format
}

/**
 * Helper to map backend ReportDto -> frontend Report
 * backend ReportDto uses `pdfPath` (string|null). We expose `hasPdf` boolean.
 */
function mapReportDtoToReport(dto: any): Report {
  return {
    id: dto.id,
    weekStartDate: dto.weekStartDate,
    weekEndDate: dto.weekEndDate,
    generatedAt: dto.generatedAt,
    healthSummary: dto.healthSummary,
    riskAreas: dto.riskAreas,
    recommendations: dto.recommendations,
    pdfPath: dto.pdfPath,
    hasPdf: !!(dto.pdfPath && dto.pdfPath.toString().trim().length > 0),
  };
}

export const reportService = {
  // Generate weekly report
  generateWeeklyReport: async (): Promise<Report> => {
    const response = await api.post('/api/reports/generate');
    // backend returns ReportDto — map it
    return mapReportDtoToReport(response.data);
  },

  // Generate custom date range report
  generateCustomReport: async (params: CustomReportParams): Promise<Report> => {
    // Ensure dates are in YYYY-MM-DD format
    const formattedStartDate = new Date(params.startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(params.endDate).toISOString().split('T')[0];

    const response = await api.post(`/api/reports/generate/custom?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
    return mapReportDtoToReport(response.data);
  },

  // Get user reports (list)
  getUserReports: async (): Promise<Report[]> => {
    const response = await api.get('/api/reports/my');
    // Map each dto to frontend Report
    return (response.data || []).map((dto: any) => mapReportDtoToReport(dto));
  },

  // Get user reports (paginated)
  getUserReportsPaginated: async (params: GetReportsParams = {}): Promise<PaginatedResponse<Report>> => {
    const response = await api.get('/api/reports/my/paginated', { params });
    const data = response.data as PaginatedResponse<any>;
    // Map content
    const mapped: PaginatedResponse<Report> = {
      ...data,
      content: (data.content || []).map((dto: any) => mapReportDtoToReport(dto))
    };
    return mapped;
  },

  // Get specific report
  getReport: async (reportId: number): Promise<Report> => {
    const response = await api.get(`/api/reports/${reportId}`);
    return mapReportDtoToReport(response.data);
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