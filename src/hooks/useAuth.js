import { useDispatch, useSelector } from 'react-redux';
import { removeAuthToken, setAuthToken } from '../api/client';
import { userApi } from '../api/userApi';
import { logout, setLoading, setUser } from '../redux/slices/userSlice';

/**
 * Custom hook for authentication operations
 * Provides login, register, logout functions and auth state
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.info);
  const loading = useSelector((state) => state.user.loading);

  /**
   * Login user with email and password
   */
  const login = async (email, password) => {
    try {
      dispatch(setLoading(true));
      const response = await userApi.login(email, password);

      // Store auth token
      if (response.token) {
        await setAuthToken(response.token);
      }

      // Update user state
      dispatch(setUser(response.user));

      return { success: true, data: response };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed. Please try again.',
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Register new user
   */
  const register = async (name, email, password) => {
    try {
      dispatch(setLoading(true));
      const response = await userApi.register(name, email, password);

      // Store auth token
      if (response.token) {
        await setAuthToken(response.token);
      }

      // Update user state
      dispatch(setUser(response.user));

      return { success: true, data: response };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed. Please try again.',
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Logout current user
   */
  const logoutUser = async () => {
    try {
      dispatch(setLoading(true));
      await userApi.logout();

      // Remove auth token
      await removeAuthToken();

      // Clear user state
      dispatch(logout());

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      await removeAuthToken();
      dispatch(logout());

      return { success: false, error: error.message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Get current user profile
   */
  const getProfile = async () => {
    try {
      dispatch(setLoading(true));
      const response = await userApi.getProfile();
      dispatch(setUser(response));

      return { success: true, data: response };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch profile.',
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await userApi.updateProfile(data);
      dispatch(setUser(response));

      return { success: true, data: response };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile.',
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Request password reset
   */
  const forgotPassword = async (email) => {
    try {
      dispatch(setLoading(true));
      const response = await userApi.forgotPassword(email);

      return { success: true, data: response };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send reset email.',
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout: logoutUser,
    getProfile,
    updateProfile,
    forgotPassword,
  };
};

export default useAuth;
