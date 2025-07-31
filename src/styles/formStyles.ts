import { SxProps, Theme } from '@mui/material/styles';

/**
 * Centralized form styling for consistent field alignment and mobile responsiveness
 * Addresses the field description vertical centering issue mentioned by the user
 */
export const getFormFieldStyles = (isMobile: boolean): SxProps<Theme> => ({
  mt: 0,
  '& .MuiTextField-root, & .MuiFormControl-root': {
    // Ensure consistent label positioning and field alignment
    '& .MuiInputLabel-root': {
      // Vertical centering for labels
      display: 'flex',
      alignItems: 'center',
      transformOrigin: 'top left',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: isMobile ? 2 : 1.5,
      // Ensure vertical alignment of input content
      '& .MuiInputBase-input': {
        fontSize: isMobile ? '16px' : '14px',
        // Vertical alignment for input text
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
      },
      // Special handling for multiline fields to maintain alignment
      '&.MuiInputBase-multiline': {
        '& .MuiInputBase-input': {
          alignItems: 'flex-start',
          paddingTop: isMobile ? '12px' : '8px',
        },
      },
    },
    // Ensure consistent helper text positioning
    '& .MuiFormHelperText-root': {
      marginLeft: 0,
      marginRight: 0,
      marginTop: '4px',
    },
  },
  // Additional alignment for FormControl components (Select, DatePicker)
  '& .MuiFormControl-root': {
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      fontSize: isMobile ? '16px' : '14px',
    },
  },
});

/**
 * Grid container props for consistent modal layout
 */
export const getFormGridProps = (isMobile: boolean) => ({
  container: true,
  spacing: isMobile ? 2 : 2,
  sx: getFormFieldStyles(isMobile),
});