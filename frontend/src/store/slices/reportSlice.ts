import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  reportService, 
  Report, 
  CustomReportParams,
  GetReportsParams,
  PaginatedResponse 
} from '../../services/reportService';

interface ReportState {
  reports: Report[];
  paginatedReports: PaginatedResponse<Report> | null;
  currentReport: Report | null;
  isLoading: boolean;
  isGenerating: boolean;
  isDownloading: boolean;
  isDeleting: boolean;
  error: string | null;
}

const initialState: ReportState = {
  reports: [],
  paginatedReports: null,
  currentReport: null,
  isLoading: false,
  isGenerating: false,
  isDownloading: false,
  isDeleting: false,
  error: null,
};

// Async thunks
export const generateWeeklyReport = createAsyncThunk(
  'reports/generateWeeklyReport',
  async (_, { rejectWithValue }) => {
    try {
      const report = await reportService.generateWeeklyReport();
      return report;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate weekly report');
    }
  }
);

export const generateCustomReport = createAsyncThunk(
  'reports/generateCustomReport',
  async (params: CustomReportParams, { rejectWithValue }) => {
    try {
      const report = await reportService.generateCustomReport(params);
      return report;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate custom report');
    }
  }
);

export const getUserReports = createAsyncThunk(
  'reports/getUserReports',
  async (_, { rejectWithValue }) => {
    try {
      const reports = await reportService.getUserReports();
      return reports;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
    }
  }
);

export const getUserReportsPaginated = createAsyncThunk(
  'reports/getUserReportsPaginated',
  async (params: GetReportsParams, { rejectWithValue }) => {
    try {
      const paginatedReports = await reportService.getUserReportsPaginated(params);
      return paginatedReports;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch paginated reports');
    }
  }
);

export const getReport = createAsyncThunk(
  'reports/getReport',
  async (reportId: number, { rejectWithValue }) => {
    try {
      const report = await reportService.getReport(reportId);
      return report;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch report');
    }
  }
);

export const downloadReportPdf = createAsyncThunk<Blob, number>(
  'reports/downloadReportPdf',
  async (reportId: number, { rejectWithValue }) => {
    try {
      const blob = await reportService.downloadReportPdf(reportId);
      return blob;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to download report PDF');
    }
  }
);

export const deleteReport = createAsyncThunk(
  'reports/deleteReport',
  async (reportId: number, { rejectWithValue }) => {
    try {
      await reportService.deleteReport(reportId);
      return reportId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete report');
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
    clearReports: (state) => {
      state.reports = [];
      state.paginatedReports = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate weekly report
      .addCase(generateWeeklyReport.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateWeeklyReport.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.reports = [action.payload, ...state.reports];
        state.currentReport = action.payload;
        state.error = null;
      })
      .addCase(generateWeeklyReport.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      })
      // Generate custom report
      .addCase(generateCustomReport.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateCustomReport.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.reports = [action.payload, ...state.reports];
        state.currentReport = action.payload;
        state.error = null;
      })
      .addCase(generateCustomReport.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      })
      // Get user reports
      .addCase(getUserReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
        state.error = null;
      })
      .addCase(getUserReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get user reports paginated
      .addCase(getUserReportsPaginated.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserReportsPaginated.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paginatedReports = action.payload;
        state.reports = action.payload.content;
        state.error = null;
      })
      .addCase(getUserReportsPaginated.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get specific report
      .addCase(getReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReport = action.payload;
        state.error = null;
      })
      .addCase(getReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Download report PDF
      .addCase(downloadReportPdf.pending, (state) => {
        state.isDownloading = true;
        state.error = null;
      })
      .addCase(downloadReportPdf.fulfilled, (state) => {
        state.isDownloading = false;
        state.error = null;
      })
      .addCase(downloadReportPdf.rejected, (state, action) => {
        state.isDownloading = false;
        state.error = action.payload as string;
      })
      // Delete report
      .addCase(deleteReport.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.reports = state.reports.filter(report => report.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentReport, clearReports } = reportSlice.actions;
export default reportSlice.reducer;