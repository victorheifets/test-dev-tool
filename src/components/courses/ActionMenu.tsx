import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, Typography, Stack } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

interface ActionMenuProps {
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
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

  return (
    <Stack direction="row" spacing={0}>
      <IconButton onClick={onEdit} color="primary">
        <EditIcon />
      </IconButton>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { onDuplicate(); handleClose(); }}>
          <ListItemIcon>
            <FileCopyIcon color="info" />
          </ListItemIcon>
          <Typography>{t('actions.duplicate')}</Typography>
        </MenuItem>
        <MenuItem onClick={() => { onDelete(); handleClose(); }}>
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <Typography color="error">{t('actions.delete')}</Typography>
        </MenuItem>
      </Menu>
    </Stack>
  );
}; 