import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useTranslation } from 'react-i18next';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      aria-labelledby="confirmation-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle id="confirmation-dialog-title">
        <Box display="flex" alignItems="center">
          <WarningAmberIcon color="error" sx={{ mr: 1 }} />
          {title}
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={onConfirm} variant="contained" color="error" autoFocus>
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 