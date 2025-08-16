import api from './api';

export interface User {
  id: number;
  googleId: string;
  email: string;
  name: string;
  profilePicture: string;
  createdAt: string;
}

export interface UpdateUserRequest {
  name: string;
}

export const authService = {
  
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/users/me');
    console.log('[authService] /api/users/me response:', response);
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (data: UpdateUserRequest): Promise<User> => {
    const response = await api.put('/api/users/me', data);
    return response.data;
  },

  // Google OAuth login (redirect to backend OAuth endpoint)
  initiateGoogleLogin: () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${baseUrl}/api/oauth2/authorization/google`;
  },

  // Logout (just redirect to backend logout)
  logout: () => { 
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${baseUrl}/api/logout`;
  },
};