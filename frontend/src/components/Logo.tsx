import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface LogoProps {
  variant?: 'full' | 'compact';
  height?: number | string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'full', height = 50 }) => {
  const theme = useTheme();
  const svgHeight = typeof height === 'number' ? height : parseInt(height as string, 10);
  const svgWidth = svgHeight * 2;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: height }}>
      <svg
        height={svgHeight}
        width={svgWidth}
        viewBox="0 0 230 120"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginRight: variant === 'full' ? 8 : 0 }}
      >
        {/* Fish shape - main outline */}
        <path
          d="M50 70C30 85 20 70 15 55C10 40 15 25 35 15C55 5 75 10 90 25C105 40 115 60 130 65C145 70 160 65 170 55C155 75 135 85 115 80C95 75 85 60 70 55C55 50 45 55 50 70Z"
          fill={theme.palette.secondary.main}
          opacity="0.8"
        />
        
        {/* Curved line below fish */}
        <path
          d="M20 85C60 95 100 90 140 80C180 70 200 65 220 70"
          stroke={theme.palette.secondary.light}
          strokeWidth="3"
          fill="none"
          opacity="0.5"
        />
        
        {/* Small dots/bubbles */}
        <circle cx="20" cy="30" r="3" fill={theme.palette.secondary.dark} />
        <circle cx="30" cy="20" r="2" fill={theme.palette.secondary.dark} />
        <circle cx="40" cy="15" r="2.5" fill={theme.palette.secondary.dark} />
        <circle cx="50" cy="25" r="2" fill={theme.palette.secondary.dark} />
        
        {/* Fish eye */}
        <circle cx="40" cy="35" r="5" fill={theme.palette.secondary.dark} />
        
        {/* Fish details */}
        <path
          d="M60 40C70 30 90 25 110 35C120 40 130 50 135 60C120 45 95 35 60 40Z"
          fill={theme.palette.secondary.dark}
          opacity="0.6"
        />
        
        {/* Fish fin */}
        <path
          d="M75 15C85 5 95 10 100 20C90 15 80 15 75 15Z"
          fill={theme.palette.secondary.light}
          opacity="0.7"
        />
        
        {/* Fish tail */}
        <path
          d="M15 60C5 50 10 40 15 35C18 45 20 55 15 60Z"
          fill={theme.palette.secondary.light}
          opacity="0.7"
        />

        {/* Leaf elements to emphasize "Green" */}
        <path
          d="M160 30C170 20 180 25 175 35C165 30 160 30 160 30Z"
          fill={theme.palette.primary.main}
          opacity="0.7"
        />
        
        <path
          d="M170 25C180 15 190 20 185 30C175 25 170 25 170 25Z"
          fill={theme.palette.primary.light}
          opacity="0.6"
        />
      </svg>

      {variant === 'full' && (
        <Box>
          <Typography
            variant="h5"
            component="span"
            sx={{
              fontWeight: 700,
              display: 'block',
              lineHeight: 1.2,
              letterSpacing: '0.5px',
            }}
          >
            <span style={{ color: theme.palette.primary.main, textShadow: '0px 1px 2px rgba(0,0,0,0.1)' }}>Green</span>
            <span style={{ color: theme.palette.secondary.main, textShadow: '0px 1px 2px rgba(0,0,0,0.1)' }}>Sea</span>
          </Typography>
          <Typography
            variant="caption"
            component="span"
            sx={{
              color: theme.palette.text.secondary,
              letterSpacing: 1,
              textTransform: 'uppercase',
              fontSize: '0.6rem',
              display: 'block',
              lineHeight: 1,
            }}
          >
            FRESH FISH AND VEGETABLES
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Logo; 