import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  useTheme,
  useMediaQuery,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef<
  unknown,
  TransitionProps & {
    children: React.ReactElement<any, any>;
  }
>((props, ref) => <Slide direction="up" ref={ref} {...props} />);

interface CommonModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSave: () => void;
  onCancel?: () => void;
  forceMobile?: boolean;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  saveButtonText?: string;
  cancelButtonText?: string;
  saveButtonDisabled?: boolean;
  saveButtonStartIcon?: React.ReactNode;
  showActions?: boolean;
  fullScreen?: boolean;
}

export const CommonModalShell: React.FC<CommonModalShellProps> = ({
  open,
  onClose,
  title,
  onSave,
  onCancel,
  forceMobile,
  children,
  maxWidth = 'sm',
  saveButtonText = 'Save',
  cancelButtonText = 'Cancel',
  saveButtonDisabled = false,
  saveButtonStartIcon,
  showActions = true,
  fullScreen,
}) => {
  const theme = useTheme();
  const isMobileDetected = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = forceMobile !== undefined ? forceMobile : isMobileDetected;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={fullScreen !== undefined ? fullScreen : isMobile}
      TransitionComponent={isMobile ? Transition : undefined}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          margin: isMobile ? 0 : 2,
          maxHeight: isMobile ? '100vh' : '90vh',
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle 
        sx={{
          backgroundColor: isMobile ? 'primary.main' : 'background.paper',
          color: isMobile ? 'primary.contrastText' : 'text.primary',
          py: isMobile ? 2 : 1.5,
          px: isMobile ? 2 : 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: isMobile ? '1px solid' : 'none',
          borderColor: isMobile ? 'rgba(255, 255, 255, 0.12)' : 'divider',
        }}
      >
        <Box sx={{ 
          fontSize: isMobile ? '1.25rem' : '1.5rem',
          fontWeight: 600,
        }}>
          {title}
        </Box>
        {isMobile && (
          <IconButton
            onClick={onClose}
            sx={{
              color: 'inherit',
              ml: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent 
        sx={{
          backgroundColor: isMobile ? '#f8f9fa' : 'background.paper',
          px: isMobile ? 2 : 3,
          py: isMobile ? 2 : 2,
          overflow: 'auto',
          flex: 1,
        }}
      >
        {children}
      </DialogContent>
      
      {showActions && (
        <DialogActions 
          sx={{
            backgroundColor: isMobile ? 'background.paper' : 'background.paper',
            px: isMobile ? 2 : 3,
            py: isMobile ? 2 : 1.5,
            borderTop: isMobile ? '1px solid' : 'none',
            borderColor: 'divider',
            gap: 1,
          }}
        >
          <Button 
            onClick={handleCancel}
            sx={{
              minWidth: isMobile ? 80 : 64,
              height: isMobile ? 44 : 36,
            }}
          >
            {cancelButtonText}
          </Button>
          <Button 
            onClick={onSave} 
            variant="contained"
            disabled={saveButtonDisabled}
            startIcon={saveButtonStartIcon}
            sx={{
              minWidth: isMobile ? 80 : 64,
              height: isMobile ? 44 : 36,
            }}
          >
            {saveButtonText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};