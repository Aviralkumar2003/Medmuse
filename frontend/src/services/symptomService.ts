import api from './api';

export interface Symptom {
  id: number;
  name: string;
  category: string;
  description: string;
  isActive: boolean;
}

export const symptomService = {
  // Get all symptoms
  getAllSymptoms: async (): Promise<Symptom[]> => {
    const response = await api.get('/api/symptoms/getAllSymptoms');
    return response.data;
  },

  // Get symptoms by category
  getSymptomsByCategory: async (category: string): Promise<Symptom[]> => {
    const response = await api.get(`/api/symptoms/category/${encodeURIComponent(category)}`);
    return response.data;
  },

  // Search symptoms
  searchSymptoms: async (query: string): Promise<Symptom[]> => {
    const response = await api.get('/api/symptoms/search', {
      params: { q: query }
    });
    return response.data;
  }
};