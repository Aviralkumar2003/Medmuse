import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, User, UpdateUserRequest, UpdateDemographicsRequest, UserDemographics } from '../../services/authService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (data: UpdateUserRequest, { rejectWithValue }) => {
    try {
      const user = await authService.updateUserProfile(data);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const updateUserDemographics = createAsyncThunk(
  'auth/updateUserDemographics',
  async (data: UpdateDemographicsRequest, { rejectWithValue }) => {
    try {
      const demographics = await authService.updateUserDemographics(data);
      return demographics;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update demographics');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: () => {
      authService.initiateGoogleLogin();
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.isLoading = false;
      // The actual logout and redirect is handled by authService.logout()
      authService.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        console.log('[authSlice] getCurrentUser.rejected:', action.payload);
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update user demographics
      .addCase(updateUserDemographics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserDemographics.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user.demographics = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUserDemographics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { loginStart, logout, clearError } = authSlice.actions;
export default authSlice.reducer;