import React from 'react';
import { Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LinkIcon from '@mui/icons-material/Link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { RegistrationForm } from '../../../types/registration-form';

interface CompactRegistrationFormContentProps {
  form: RegistrationForm;
  onCopyUrl?: (url: string) => void;
  onPreviewForm?: (url: string) => void;
}

export const CompactRegistrationFormContent: React.FC<CompactRegistrationFormContentProps> = ({
  form,
  onCopyUrl,
  onPreviewForm
}) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 0.5 }}>
      {/* Header with Title and Status */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <AssignmentIcon sx={{ fontSize: 20, color: 'text.secondary', mt: 0.2 }} />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mb: 0.5
            }}
          >
            {form.title}
          </Typography>
          <Chip
            icon={form.is_active ? <CheckCircleIcon /> : <PauseCircleIcon />}
            label={form.is_active ? t('registrationForm.published') : t('registrationForm.draft')}
            color={form.is_active ? 'success' : 'warning'}
            size="small"
            variant={form.is_active ? 'filled' : 'outlined'}
            sx={{ 
              height: 20, 
              fontSize: '0.7rem',
              '& .MuiChip-icon': {
                fontSize: 12
              }
            }}
          />
        </Box>
      </Box>

      {/* Description */}
      <Box sx={{ pl: 3 }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontSize: '0.8rem',
            lineHeight: 1.3
          }}
        >
          {form.description}
        </Typography>
      </Box>

      {/* Metadata and Actions */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pl: 3,
        pt: 1,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            {form.published_at 
              ? `${t('registrationForm.publishedAt')}: ${formatDate(form.published_at)}`
              : t('registrationForm.notPublished')
            }
          </Typography>
        </Box>
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={t('actions.copy_url')}>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onCopyUrl?.(form.form_url);
              }}
              sx={{ p: 0.5 }}
            >
              <LinkIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('actions.preview')}>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onPreviewForm?.(form.form_url);
              }}
              sx={{ p: 0.5 }}
            >
              <VisibilityIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};