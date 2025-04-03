import React, { useEffect } from 'react';
import { Global, css } from '@emotion/react';
import { useTheme } from '@mui/material';
import { CustomCursor } from './AwwwardsEffects';
import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

interface GlobalStylesProps {
  enableCustomCursor?: boolean;
  reduceAnimations?: boolean;
}

const GlobalStyles: React.FC<GlobalStylesProps> = ({ 
  enableCustomCursor = true,
  reduceAnimations = false
}) => {
  const theme = useTheme();
  
  // Apply smooth scrolling and hide scrollbar when mounted
  useEffect(() => {
    // Add smooth scrolling to HTML element
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Create a style element for custom scrollbar
    const style = document.createElement('style');
    style.textContent = `
      /* Hide scrollbar for Chrome, Safari and Opera */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      /* Track */
      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
      }
      
      /* Handle */
      ::-webkit-scrollbar-thumb {
        background: ${theme.palette.primary.main}40;
        border-radius: 4px;
      }
      
      /* Handle on hover */
      ::-webkit-scrollbar-thumb:hover {
        background: ${theme.palette.primary.main}80;
      }
      
      /* Selection color */
      ::selection {
        background-color: ${theme.palette.primary.main}40;
        color: ${theme.palette.primary.dark};
      }
    `;
    
    // Append style to head
    document.head.appendChild(style);
    
    // Cleanup
    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.head.removeChild(style);
    };
  }, [theme.palette.primary.main, theme.palette.primary.dark]);
  
  return (
    <>
      <MuiGlobalStyles
        styles={{
          '*': {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
          
          'html, body': {
            width: '100%',
            height: '100%',
            cursor: enableCustomCursor ? 'none' : 'auto',
            overflowX: 'hidden',
          },
          
          'body.modal-open': {
            overflow: 'hidden',
          },
          
          // Custom cursor styling (only if enabled)
          ...(enableCustomCursor ? {
            '.custom-cursor': {
              position: 'fixed',
              pointerEvents: 'none',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              mixBlendMode: 'difference',
              zIndex: 9999,
              transform: 'translate(-50%, -50%)',
              transition: reduceAnimations 
                ? 'none' 
                : 'transform 0.1s ease, width 0.2s ease, height 0.2s ease',
            },
            '.custom-cursor.hover': {
              width: '60px',
              height: '60px',
              backgroundColor: '#fff',
              mixBlendMode: 'difference',
            },
            'a, button, [role="button"]': {
              cursor: 'none',
              '&:hover ~ .custom-cursor': {
                width: '60px',
                height: '60px',
                backgroundColor: '#fff',
                mixBlendMode: 'difference',
              }
            }
          } : {}),
          
          // Optimized animations
          '.card-hover': {
            transition: reduceAnimations 
              ? 'none' 
              : 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: reduceAnimations ? 'none' : 'translateY(-10px)',
              boxShadow: reduceAnimations 
                ? 'none' 
                : '0 20px 30px rgba(0, 0, 0, 0.1)',
            }
          },
          
          // Optimized image zoom effects
          '.image-zoom-container': {
            overflow: 'hidden',
            position: 'relative',
          },
          '.image-zoom': {
            transition: reduceAnimations ? 'none' : 'transform 0.6s ease-in-out',
            '.card-hover:hover &': {
              transform: reduceAnimations ? 'none' : 'scale(1.1)',
            }
          },
          
          // Remove excessive transitions when reducedAnimations is enabled
          ...(reduceAnimations ? {
            '*': {
              transition: 'none !important',
              animation: 'none !important',
            },
            'a, button, input, select, textarea': {
              transition: 'color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out !important',
            }
          } : {}),
        }}
      />
      
      <Global
        styles={css`
          /* Base styles */
          html {
            overflow-x: hidden;
            scroll-behavior: smooth;
          }
          
          body {
            overflow-x: hidden;
            position: relative;
            min-height: 100vh;
          }
          
          /* Animations */
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes slideInLeft {
            from { transform: translateX(-30px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes slideInRight {
            from { transform: translateX(30px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes scale {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          
          @keyframes rotateIn {
            from { transform: rotate(-5deg) scale(0.9); opacity: 0; }
            to { transform: rotate(0) scale(1); opacity: 1; }
          }
          
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          /* Text animations */
          .text-reveal {
            opacity: 0;
            animation: slideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          }
          
          .text-reveal-delayed {
            opacity: 0;
            animation: slideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards;
          }
          
          /* Image animations */
          .image-reveal {
            opacity: 0;
            animation: scale 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          }
          
          /* Button animations */
          button, a {
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), 
                        box-shadow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                        background-color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          }
          
          button:active, a:active {
            transform: scale(0.97) !important;
          }
          
          /* Card animations */
          .card-hover {
            transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1),
                        box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1) !important;
          }
          
          .card-hover:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
          }
          
          /* Magnetic buttons */
          .magnetic-button {
            transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1) !important;
          }
          
          /* Image hover effects */
          .image-zoom-container {
            overflow: hidden;
            border-radius: inherit;
          }
          
          .image-zoom {
            transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1) !important;
          }
          
          .image-zoom-container:hover .image-zoom {
            transform: scale(1.1);
          }
          
          /* Text gradient effect */
          .text-gradient {
            background-image: linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
          }
          
          /* Loading shimmer effect */
          .shimmer {
            background: linear-gradient(90deg, 
              rgba(255, 255, 255, 0.1), 
              rgba(255, 255, 255, 0.2), 
              rgba(255, 255, 255, 0.1)
            );
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          
          /* Floating animation */
          .float {
            animation: float 6s ease-in-out infinite;
          }
          
          .float-slow {
            animation: float 8s ease-in-out infinite;
          }
          
          .float-reverse {
            animation: float 6s ease-in-out infinite reverse;
          }
          
          /* Mask reveal effect */
          .mask-reveal {
            clip-path: inset(0 100% 0 0);
            animation: maskReveal 1s cubic-bezier(0.77, 0, 0.18, 1) forwards;
          }
          
          @keyframes maskReveal {
            from { clip-path: inset(0 100% 0 0); }
            to { clip-path: inset(0 0 0 0); }
          }
          
          /* Liquid button effect */
          .liquid-button {
            position: relative;
            overflow: hidden;
          }
          
          .liquid-button::before {
            content: '';
            position: absolute;
            top: var(--y, 50%);
            left: var(--x, 50%);
            width: 0;
            height: 0;
            background: radial-gradient(circle closest-side, rgba(255, 255, 255, 0.2), transparent);
            transform: translate(-50%, -50%);
            transition: width 0.5s ease, height 0.5s ease;
          }
          
          .liquid-button:hover::before {
            width: 200%;
            height: 200%;
          }
          
          /* Text splitting effect */
          .split-text-container {
            overflow: hidden;
          }
          
          .split-text {
            display: inline-block;
            opacity: 0;
            transform: translateY(100%);
            animation: splitTextReveal 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          }
          
          @keyframes splitTextReveal {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Scroll indicator */
          .scroll-indicator {
            opacity: 0;
            animation: fadeIn 1s forwards 1s;
          }
          
          .scroll-arrow {
            animation: scrollArrow 1.5s infinite;
          }
          
          @keyframes scrollArrow {
            0% { transform: translateY(0); opacity: 0.8; }
            50% { transform: translateY(10px); opacity: 1; }
            100% { transform: translateY(0); opacity: 0.8; }
          }
          
          /* Staggered reveal animation helper classes */
          .stagger-reveal > * {
            opacity: 0;
            transform: translateY(20px);
          }
          
          .stagger-reveal.active > *:nth-child(1) {
            animation: slideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.1s forwards;
          }
          
          .stagger-reveal.active > *:nth-child(2) {
            animation: slideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards;
          }
          
          .stagger-reveal.active > *:nth-child(3) {
            animation: slideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.3s forwards;
          }
          
          .stagger-reveal.active > *:nth-child(4) {
            animation: slideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.4s forwards;
          }
          
          .stagger-reveal.active > *:nth-child(5) {
            animation: slideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.5s forwards;
          }
          
          .stagger-reveal.active > *:nth-child(6) {
            animation: slideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.6s forwards;
          }
          
          /* 3D Card effect */
          .card-3d {
            transform-style: preserve-3d;
            transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          }
          
          .card-3d-content {
            transform: translateZ(50px);
          }
          
          /* Link hover effect */
          .link-hover {
            position: relative;
            text-decoration: none;
          }
          
          .link-hover::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: currentColor;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          }
          
          .link-hover:hover::after {
            transform: scaleX(1);
            transform-origin: left;
          }
          
          /* Horizontal scroll container */
          .horizontal-scroll {
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          
          .horizontal-scroll::-webkit-scrollbar {
            display: none;
          }
          
          /* Overriding MUI specific components for better animations */
          .MuiPaper-root {
            transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1),
                        box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1) !important;
          }
          
          /* Add blend mode support */
          .blend-overlay {
            mix-blend-mode: overlay;
          }
          
          .blend-multiply {
            mix-blend-mode: multiply;
          }
          
          .blend-screen {
            mix-blend-mode: screen;
          }
          
          .blend-difference {
            mix-blend-mode: difference;
          }
          
          /* Make all images draggable false */
          img {
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          
          /* Add noise texture */
          .noise-texture {
            position: relative;
          }
          
          .noise-texture::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
            opacity: 0.05;
            mix-blend-mode: overlay;
            pointer-events: none;
          }
          
          /* Glass morphism */
          .glass {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        `}
      />
      
      {enableCustomCursor && <CustomCursor />}
    </>
  );
};

export default GlobalStyles; 