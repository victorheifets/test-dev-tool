import React, { useEffect, useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useLogin } from '@refinedev/core';
import { API_CONFIG } from '../../config/api';

interface GoogleConfig {
  google_enabled: boolean;
  client_id: string | null;
}

interface GoogleSignInProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const GoogleSignIn: React.FC<GoogleSignInProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const [googleConfig, setGoogleConfig] = useState<GoogleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mutate: login } = useLogin();

  useEffect(() => {
    // Fetch Google configuration from backend
    const fetchGoogleConfig = async () => {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}/auth/google/config`);
        if (response.ok) {
          const config = await response.json();
          setGoogleConfig(config);
        } else {
          setError('Failed to load Google authentication configuration');
        }
      } catch (err) {
        setError('Failed to connect to authentication service');
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleConfig();
  }, []);

  const handleGoogleSuccess = (credentialResponse: any) => {
    const googleToken = credentialResponse.credential;
    
    if (!googleToken) {
      const errorMsg = 'No Google token received';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Use Refine's login with Google token
    login(
      { google_token: googleToken },
      {
        onSuccess: () => {
          console.log('Google login successful');
          onSuccess?.();
        },
        onError: (error: any) => {
          const errorMsg = error?.message || error?.detail || 'Google login failed';
          console.error('Google login failed:', errorMsg);
          setError(errorMsg);
          onError?.(errorMsg);
        },
      }
    );
  };

  const handleGoogleError = () => {
    const errorMsg = 'Google Sign-In failed';
    setError(errorMsg);
    onError?.(errorMsg);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={2}>
        <CircularProgress size={20} />
        <Typography variant="body2" sx={{ ml: 1 }}>
          Loading Google Sign-In...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 1 }}>
        {error}
      </Alert>
    );
  }

  if (!googleConfig?.google_enabled || !googleConfig?.client_id) {
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        Google Sign-In is not configured
      </Alert>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleConfig.client_id}>
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Or sign in with Google
        </Typography>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
        />
      </Box>
    </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;