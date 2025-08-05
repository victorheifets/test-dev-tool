import { AuthProvider } from "@refinedev/core";
import { API_CONFIG } from "../config/api";

/**
 * Authentication Provider for Course Management API
 * Handles JWT token-based authentication
 */

const TOKEN_KEY = "auth-token";
const REFRESH_TOKEN_KEY = "refresh-token";
const USER_KEY = "user-info";

interface LoginParams {
  email: string;
  password: string;
}

interface GoogleLoginParams {
  google_token: string;
}

interface UserInfo {
  user_id: string;
  email: string;
  name: string;
  role: string;
  provider_id?: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user?: UserInfo;
}


export const authProvider: AuthProvider = {
  // Login method - supports both email/password and Google auth
  login: async (params: LoginParams | GoogleLoginParams) => {
    // Check if this is Google authentication
    if ('google_token' in params) {
      return await loginWithGoogle(params);
    }
    
    // Regular email/password login
    const { email, password } = params as LoginParams;
    try {
      console.log("[Auth] Attempting login for:", email);
      
      const response = await fetch(`${API_CONFIG.baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.detail || "Login failed";
        console.error("[Auth] Login failed:", errorMessage);
        return {
          success: false,
          error: {
            message: errorMessage,
            name: "LoginError",
          },
        };
      }

      const data: LoginResponse = await response.json();
      console.log("[Auth] Login successful");

      // Store tokens
      localStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);

      // Get user info
      try {
        const userResponse = await fetch(`${API_CONFIG.baseURL}/auth/me`, {
          headers: {
            "Authorization": `Bearer ${data.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (userResponse.ok) {
          const userInfo: UserInfo = await userResponse.json();
          localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
          console.log("[Auth] User info retrieved:", userInfo);
        }
      } catch (error) {
        console.warn("[Auth] Failed to fetch user info:", error);
      }

      return {
        success: true,
        redirectTo: "/dashboard",
      };
    } catch (error) {
      console.error("[Auth] Login error:", error);
      return {
        success: false,
        error: {
          message: "Network error during login",
          name: "NetworkError",
        },
      };
    }
  },

  // Logout method
  logout: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (token) {
        // Call logout endpoint to invalidate token on server
        try {
          await fetch(`${API_CONFIG.baseURL}/auth/logout`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.warn("[Auth] Server logout failed:", error);
        }
      }

      // Clear local storage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      console.log("[Auth] Logout successful");
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      console.error("[Auth] Logout error:", error);
      return {
        success: true, // Always succeed logout locally
        redirectTo: "/login",
      };
    }
  },

  // Check authentication status
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) {
      console.log("[Auth] No token found");
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }

    try {
      // Verify token with server
      const response = await fetch(`${API_CONFIG.baseURL}/auth/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userInfo = await response.json();
        localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
        console.log("[Auth] Token valid, user authenticated");
        return {
          authenticated: true,
        };
      } else if (response.status === 401) {
        console.log("[Auth] Token expired, attempting refresh");
        
        // Try to refresh token
        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {
          return {
            authenticated: true,
          };
        }
        
        // Refresh failed, clear tokens
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      } else {
        console.error("[Auth] Token validation failed");
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      }
    } catch (error) {
      console.error("[Auth] Auth check error:", error);
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  // Get user identity
  getIdentity: async () => {
    
    try {
      const userInfo = localStorage.getItem(USER_KEY);
      if (userInfo) {
        const user: UserInfo = JSON.parse(userInfo);
        return {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1976d2&color=fff`,
        };
      }

      // If no cached user info, try to fetch from server
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        const response = await fetch(`${API_CONFIG.baseURL}/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const user: UserInfo = await response.json();
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          return {
            id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1976d2&color=fff`,
          };
        }
      }

      return null;
    } catch (error) {
      console.error("[Auth] Get identity error:", error);
      return null;
    }
  },

  // Handle authentication errors
  onError: async (error) => {
    console.error("[Auth] Authentication error:", error);
    
    if (error?.status === 401) {
      // Try to refresh token
      const refreshSuccess = await refreshAccessToken();
      if (!refreshSuccess) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        
        return {
          redirectTo: "/login",
          logout: true,
        };
      }
    }

    return {};
  },
};

// Google authentication function
async function loginWithGoogle(params: GoogleLoginParams) {
  try {
    console.log("[Auth] Attempting Google login");
    
    const response = await fetch(`${API_CONFIG.baseURL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ google_token: params.google_token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || errorData.detail || "Google login failed";
      console.error("[Auth] Google login failed:", errorMessage);
      return {
        success: false,
        error: {
          message: errorMessage,
          name: "GoogleLoginError",
        },
      };
    }

    const data: LoginResponse = await response.json();
    console.log("[Auth] Google login successful");

    // Store tokens
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);

    // Store user info from response
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      console.log("[Auth] Google user info stored:", data.user);
    }

    return {
      success: true,
      redirectTo: "/dashboard",
    };
  } catch (error) {
    console.error("[Auth] Google login error:", error);
    return {
      success: false,
      error: {
        message: "Network error during Google login",
        name: "NetworkError",
      },
    };
  }
}

// Helper function to refresh access token
async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      console.log("[Auth] No refresh token available");
      return false;
    }

    console.log("[Auth] Attempting token refresh");
    
    const response = await fetch(`${API_CONFIG.baseURL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const data: LoginResponse = await response.json();
      
      // Update stored tokens
      localStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
      
      console.log("[Auth] Token refresh successful");
      return true;
    } else {
      console.error("[Auth] Token refresh failed");
      return false;
    }
  } catch (error) {
    console.error("[Auth] Token refresh error:", error);
    return false;
  }
}

// Export helper function to get current token
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Export helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(TOKEN_KEY);
};

// Export helper function to get user info
export const getCurrentUser = (): UserInfo | null => {
  try {
    const userInfo = localStorage.getItem(USER_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch {
    return null;
  }
};