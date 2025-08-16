import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { symptomService, Symptom } from '../../services/symptomService';

interface SymptomState {
  symptoms: Symptom[];
  categories: string[];
  searchResults: Symptom[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SymptomState = {
  symptoms: [],
  categories: [],
  searchResults: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const getAllSymptoms = createAsyncThunk(
  'symptoms/getAllSymptoms',
  async (_, { rejectWithValue }) => {
    try {
      const symptoms = await symptomService.getAllSymptoms();
      return symptoms;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch symptoms');
    }
  }
);

export const getSymptomsByCategory = createAsyncThunk(
  'symptoms/getSymptomsByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const symptoms = await symptomService.getSymptomsByCategory(category);
      return symptoms;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch symptoms by category');
    }
  }
);

export const searchSymptoms = createAsyncThunk(
  'symptoms/searchSymptoms',
  async (query: string, { rejectWithValue }) => {
    try {
      const symptoms = await symptomService.searchSymptoms(query);
      return symptoms;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search symptoms');
    }
  }
);

const symptomSlice = createSlice({
  name: 'symptoms',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all symptoms
      .addCase(getAllSymptoms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllSymptoms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.symptoms = action.payload;
        // Extract unique categories
        state.categories = [...new Set(action.payload.map(symptom => symptom.category))];
        state.error = null;
      })
      .addCase(getAllSymptoms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get symptoms by category
      .addCase(getSymptomsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSymptomsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(getSymptomsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search symptoms
      .addCase(searchSymptoms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchSymptoms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchSymptoms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSearchResults, clearError } = symptomSlice.actions;
export default symptomSlice.reducer;