import React, { useState } from 'react';
import { Card, CardContent, Box, IconButton, useTheme } from '@mui/material';
import { ActionMenu } from '../courses/ActionMenu'; // Will be made generic later
import { useTranslation } from 'react-i18next';

interface CustomAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface CompactCardShellProps {
  children: React.ReactNode;
  entityId: string;
  onEdit: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete: (id: string) => void;
  onCardClick?: (id: string) => void;
  showActionMenu?: boolean;
  customActions?: CustomAction[];
  enableSwipeGestures?: boolean;
}

export const CompactCardShell: React.FC<CompactCardShellProps> = ({
  children,
  entityId,
  onEdit,
  onDuplicate,
  onDelete,
  onCardClick,
  showActionMenu = true,
  customActions,
  enableSwipeGestures = true,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [isSwipeActive, setIsSwipeActive] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipeGestures) return;
    setSwipeStartX(e.touches[0].clientX);
    setIsSwipeActive(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableSwipeGestures || swipeStartX === null) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = swipeStartX - currentX;
    
    // Trigger swipe if moved more than 50px
    if (Math.abs(diffX) > 50 && !isSwipeActive) {
      setIsSwipeActive(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!enableSwipeGestures || swipeStartX === null) return;
    
    const currentX = e.changedTouches[0].clientX;
    const diffX = swipeStartX - currentX;
    
    // Swipe left to edit (swipe left = positive diffX)
    if (diffX > 80) {
      onEdit(entityId);
    }
    // Swipe right to delete (swipe right = negative diffX)  
    else if (diffX < -80) {
      onDelete(entityId);
    }
    
    setSwipeStartX(null);
    setIsSwipeActive(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    if (onCardClick) {
      onCardClick(entityId);
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        border: '1px solid', 
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        transform: isSwipeActive ? 'scale(0.98)' : 'scale(1)',
        cursor: onCardClick ? 'pointer' : 'default',
        '&:hover': {
          boxShadow: theme.shadows[2],
          borderColor: 'primary.main',
        },
        // Touch feedback
        '&:active': {
          transform: 'scale(0.98)',
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCardClick}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          
          {/* Main content area - will be filled by entity-specific content */}
          <Box sx={{ flex: 1, minWidth: 0 }}> {/* minWidth: 0 allows text overflow */}
            {children}
          </Box>
          
          {/* Actions area */}
          {(showActionMenu || customActions) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
              {showActionMenu && (
                <ActionMenu
                  onEdit={() => onEdit(entityId)}
                  onDuplicate={onDuplicate ? () => onDuplicate(entityId) : () => {}}
                  onDelete={() => onDelete(entityId)}
                  additionalActions={customActions}
                />
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};