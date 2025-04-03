import React, { useState, useEffect } from 'react';
import { Box, Tooltip, IconButton, Switch, Typography, Paper, alpha, useTheme } from '@mui/material';
import { Speed as SpeedIcon } from '@mui/icons-material';

interface PerformanceSwitchProps {
  onChange?: (isPerformanceMode: boolean) => void;
}

const PerformanceSwitch: React.FC<PerformanceSwitchProps> = ({ onChange }) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isPerformanceMode, setIsPerformanceMode] = useState(() => {
    // Get saved preference from localStorage
    const saved = localStorage.getItem('performanceMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Call onChange when performance mode changes
  useEffect(() => {
    if (onChange) {
      onChange(isPerformanceMode);
    }
    // Save to localStorage
    localStorage.setItem('performanceMode', JSON.stringify(isPerformanceMode));
  }, [isPerformanceMode, onChange]);

  const handleToggle = () => {
    setIsPerformanceMode(prev => !prev);
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      <Tooltip title="Performance Settings">
        <IconButton
          onClick={() => setIsOpen(prev => !prev)}
          sx={{ 
            backgroundColor: alpha(theme.palette.background.paper, 0.9), 
            backdropFilter: 'blur(10px)',
            boxShadow: '0 3px 14px rgba(0,0,0,0.15)',
            color: isPerformanceMode ? 'primary.main' : 'text.secondary',
            '&:hover': {
              backgroundColor: alpha(theme.palette.background.paper, 1),
            }
          }}
        >
          <SpeedIcon />
        </IconButton>
      </Tooltip>

      {isOpen && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            right: 0,
            bottom: 60,
            width: 220,
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Performance Mode
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Reduce animations
            </Typography>
            <Switch
              checked={isPerformanceMode}
              onChange={handleToggle}
              color="primary"
              size="small"
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Enable for smoother experience on slower devices
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default PerformanceSwitch; 