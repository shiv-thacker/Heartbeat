// API Client Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

// Default headers for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// Storage key for auth token
const AUTH_TOKEN_KEY = 'authToken';

// Get auth token from storage (implement based on your storage solution)
const getAuthToken = async () => {
  try {
    // For React Native, use AsyncStorage
    // const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    // return token;
    return null; // Placeholder
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Set auth token in storage
export const setAuthToken = async (token) => {
  try {
    // For React Native, use AsyncStorage
    // await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

// Remove auth token from storage
export const removeAuthToken = async () => {
  try {
    // For React Native, use AsyncStorage
    // await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

// Create API client with request/response interceptors
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Build headers with auth token if available
  async buildHeaders(customHeaders = {}) {
    const token = await getAuthToken();
    const headers = { ...defaultHeaders, ...customHeaders };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.buildHeaders(options.headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Parse response
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw {
          status: response.status,
          message: data?.message || 'Something went wrong',
          data,
        };
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();

export default apiClient;
