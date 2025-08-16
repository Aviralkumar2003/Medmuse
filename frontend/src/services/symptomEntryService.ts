import api from './api';

export interface CreateSymptomEntryRequest {
  symptomId: number;
  severity: number;
  notes?: string;
  entryDate: string; // YYYY-MM-DD format
}

export interface CreateSymptomEntriesRequest {
  entries: CreateSymptomEntryRequest[];
}

export interface UpdateSymptomEntryRequest {
  symptomId: number;
  severity: number;
  notes?: string;
  entryDate: string; // YYYY-MM-DD format
}

export interface SymptomEntry {
  id: number;
  symptomId: number;
  severity: number;
  notes?: string;
  entryDate: string;
  symptomName: string;
  symptomCategory: string;
  createdAt: string;
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

export interface GetEntriesParams {
  page?: number;
  size?: number;
  sort?: string;
}

export const symptomEntryService = {
  // Create symptom entries
  createSymptomEntries: async (data: CreateSymptomEntriesRequest): Promise<SymptomEntry[]> => {
    const response = await api.post('/api/symptom-entries', data);
    return response.data;
  },

  // Get user symptom entries (paginated)
  getUserSymptomEntries: async (params: GetEntriesParams = {}): Promise<PaginatedResponse<SymptomEntry>> => {
    const response = await api.get('/api/symptom-entries/my', { params });
    return response.data;
  },

  // Update symptom entry
  updateSymptomEntry: async (entryId: number, data: UpdateSymptomEntryRequest): Promise<SymptomEntry> => {
    const response = await api.put(`/api/symptom-entries/${entryId}`, data);
    return response.data;
  },

  // Delete symptom entry
  deleteSymptomEntry: async (entryId: number): Promise<void> => {
    await api.delete(`/api/symptom-entries/${entryId}`);
  }
};