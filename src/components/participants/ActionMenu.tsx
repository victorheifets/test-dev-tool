import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Stack } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

interface ActionMenuProps {
  onEdit?: () => void;
  onDuplicate: () => void;
  onDelete?: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ onEdit, onDuplicate, onDelete }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleAction = (callback: () => void) => {
    handleClose();
    callback();
  };

  return (
    <Stack direction="row" spacing={0}>
      {onEdit && (
        <IconButton onClick={onEdit} color="primary" title={t('actions.edit')}>
          <EditIcon />
        </IconButton>
      )}
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleAction(onDuplicate)}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" color="info" />
          </ListItemIcon>
          <ListItemText>{t('actions.duplicate')}</ListItemText>
        </MenuItem>
        {onDelete && (
          <MenuItem onClick={() => handleAction(onDelete)}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>{t('actions.delete')}</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Stack>
  );
}; 