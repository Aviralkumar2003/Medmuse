import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  symptomEntryService, 
  SymptomEntry, 
  CreateSymptomEntriesRequest, 
  UpdateSymptomEntryRequest,
  GetEntriesParams,
  PaginatedResponse 
} from '../../services/symptomEntryService';

interface SymptomEntryState {
  entries: SymptomEntry[];
  paginatedEntries: PaginatedResponse<SymptomEntry> | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

const initialState: SymptomEntryState = {
  entries: [],
  paginatedEntries: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

// Async thunks
export const createSymptomEntries = createAsyncThunk(
  'symptomEntries/createSymptomEntries',
  async (data: CreateSymptomEntriesRequest, { rejectWithValue }) => {
    try {
      const entries = await symptomEntryService.createSymptomEntries(data);
      return entries;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create symptom entries');
    }
  }
);

export const getUserSymptomEntries = createAsyncThunk(
  'symptomEntries/getUserSymptomEntries',
  async (params: GetEntriesParams, { rejectWithValue }) => {
    try {
      const paginatedEntries = await symptomEntryService.getUserSymptomEntries(params);
      return paginatedEntries;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch symptom entries');
    }
  }
);

export const updateSymptomEntry = createAsyncThunk(
  'symptomEntries/updateSymptomEntry',
  async ({ entryId, data }: { entryId: number; data: UpdateSymptomEntryRequest }, { rejectWithValue }) => {
    try {
      const entry = await symptomEntryService.updateSymptomEntry(entryId, data);
      return entry;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update symptom entry');
    }
  }
);

export const deleteSymptomEntry = createAsyncThunk(
  'symptomEntries/deleteSymptomEntry',
  async (entryId: number, { rejectWithValue }) => {
    try {
      await symptomEntryService.deleteSymptomEntry(entryId);
      return entryId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete symptom entry');
    }
  }
);

const symptomEntrySlice = createSlice({
  name: 'symptomEntries',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearEntries: (state) => {
      state.entries = [];
      state.paginatedEntries = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create symptom entries
      .addCase(createSymptomEntries.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createSymptomEntries.fulfilled, (state, action) => {
        state.isCreating = false;
        // Add new entries to the beginning of the list
        state.entries = [...action.payload, ...state.entries];
        state.error = null;
      })
      .addCase(createSymptomEntries.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      // Get user symptom entries
      .addCase(getUserSymptomEntries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserSymptomEntries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paginatedEntries = action.payload;
        state.entries = action.payload.content;
        state.error = null;
      })
      .addCase(getUserSymptomEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update symptom entry
      .addCase(updateSymptomEntry.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateSymptomEntry.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Update the entry in the list
        const index = state.entries.findIndex(entry => entry.id === action.payload.id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSymptomEntry.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      // Delete symptom entry
      .addCase(deleteSymptomEntry.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteSymptomEntry.fulfilled, (state, action) => {
        state.isDeleting = false;
        // Remove the entry from the list
        state.entries = state.entries.filter(entry => entry.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteSymptomEntry.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearEntries } = symptomEntrySlice.actions;
export default symptomEntrySlice.reducer;