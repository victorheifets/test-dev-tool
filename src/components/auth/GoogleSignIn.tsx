import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Box, Typography, Alert } from '@mui/material';
import { useLogin } from '@refinedev/core';
import { useTranslation } from 'react-i18next';

interface GoogleSignInProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const GoogleSignIn: React.FC<GoogleSignInProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const { t } = useTranslation();
  const { mutate: login } = useLogin();

  // Use environment variable or fallback to a demo client ID
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id-here';

  const handleGoogleSuccess = (credentialResponse: any) => {
    const googleToken = credentialResponse.credential;
    
    if (!googleToken) {
      const errorMsg = t('auth.errors.no_google_token');
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
          const errorMsg = error?.message || error?.detail || t('auth.errors.google_login_failed');
          console.error('Google login failed:', errorMsg);
          onError?.(errorMsg);
        },
      }
    );
  };

  const handleGoogleError = () => {
    const errorMsg = t('auth.errors.google_signin_failed');
    onError?.(errorMsg);
  };

  // Check if Google Client ID is properly configured
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        {t('auth.errors.google_client_id_missing')}
      </Alert>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('auth.google_signin_label')}
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