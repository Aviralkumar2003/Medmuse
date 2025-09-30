import api from './api';

export interface UserDemographics {
  age: number;
  gender: string;
  weight: number;
  height: string;
  nationality: string;
}

export interface User {
  id: number;
  googleId: string;
  email: string;
  name: string;
  profilePicture: string;
  createdAt: string;
  demographics?: UserDemographics;
}

export interface UpdateUserRequest {
  name: string;
}

export interface UpdateDemographicsRequest {
  age: number;
  gender: string;
  weight: number;
  height: string;
  nationality: string;
}

export const authService = {
  
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/users/me');
    return response.data;
  },

  // Update user demographics
  updateUserDemographics: async (data: UpdateDemographicsRequest): Promise<UserDemographics> => {
    console.log("Making Api Call");
    console.log(data);
    const response = await api.post('/api/users/updateUserDemographics', data);
    console.log('[authService] /api/users/updateUserDemographics response:', response);
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

  // Logout - call logout endpoint and redirect to homepage
  logout: async () => { 
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      await fetch(`${baseUrl}/api/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always redirect to homepage after logout attempt
      window.location.href = '/';
    }
  },
};