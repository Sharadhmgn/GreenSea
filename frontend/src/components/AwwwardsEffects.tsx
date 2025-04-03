import React, { useEffect, useRef } from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { motion, useScroll, useTransform, useAnimation, useInView } from 'framer-motion';

// Custom cursor component that follows the mouse with a delay
export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    const animateCursor = () => {
      const diffX = mouseX - cursorX;
      const diffY = mouseY - cursorY;
      
      cursorX += diffX * 0.1;
      cursorY += diffY * 0.1;
      
      if (cursor) {
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
      }
      
      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <Box
      ref={cursorRef}
      sx={{
        position: 'fixed',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
        backgroundColor: alpha(theme.palette.primary.main, 0.5),
        backdropFilter: 'blur(8px)',
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.3s, height 0.3s, opacity 0.3s',
        '&:hover': { 
          width: '60px',
          height: '60px',
        },
      }}
    />
  );
};

// Parallax section for images and background elements
interface ParallaxProps {
  children: React.ReactNode;
  offset?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  speed?: number;
}

export const ParallaxSection: React.FC<ParallaxProps> = ({ 
  children, 
  offset = 50, 
  direction = 'up',
  speed = 0.5 
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const getTransform = () => {
    switch(direction) {
      case 'up':
        return useTransform(scrollYProgress, [0, 1], [offset, -offset]);
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [-offset, offset]);
      case 'left':
        return useTransform(scrollYProgress, [0, 1], [offset, -offset]);
      case 'right':
        return useTransform(scrollYProgress, [0, 1], [-offset, offset]);
      default:
        return useTransform(scrollYProgress, [0, 1], [offset, -offset]);
    }
  };
  
  const transform = getTransform();
  
  return (
    <motion.div
      ref={ref}
      style={{
        [direction === 'left' || direction === 'right' ? 'x' : 'y']: transform,
        transition: `transform ${speed}s cubic-bezier(0.17, 0.67, 0.83, 0.67)`,
      }}
    >
      {children}
    </motion.div>
  );
};

// Text reveal animation
interface TextRevealProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
  variant?: 'fade' | 'slide' | 'scale';
}

export const TextReveal: React.FC<TextRevealProps> = ({ 
  children, 
  delay = 0, 
  threshold = 0.2,
  variant = 'slide'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1, 
        transition: { 
          duration: 0.7, 
          delay,
          ease: [0.22, 1, 0.36, 1]
        }
      }
    },
    slide: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
          duration: 0.7, 
          delay,
          ease: [0.22, 1, 0.36, 1]
        }
      }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { 
        opacity: 1, 
        scale: 1, 
        transition: { 
          duration: 0.7, 
          delay,
          ease: [0.22, 1, 0.36, 1]
        }
      }
    }
  };
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants[variant]}
    >
      {children}
    </motion.div>
  );
};

// Staggered content reveal
interface StaggerRevealProps {
  children: React.ReactNode[];
  delay?: number;
  staggerDelay?: number;
  threshold?: number;
  variant?: 'fade' | 'slide' | 'scale';
}

export const StaggerReveal: React.FC<StaggerRevealProps> = ({ 
  children, 
  delay = 0, 
  staggerDelay = 0.1,
  threshold = 0.2,
  variant = 'slide'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const getVariants = () => {
    switch(variant) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: (i: number) => ({ 
            opacity: 1, 
            transition: { 
              duration: 0.5, 
              delay: delay + i * staggerDelay,
              ease: [0.22, 1, 0.36, 1]
            }
          })
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: (i: number) => ({ 
            opacity: 1, 
            scale: 1, 
            transition: { 
              duration: 0.5, 
              delay: delay + i * staggerDelay,
              ease: [0.22, 1, 0.36, 1]
            }
          })
        };
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: (i: number) => ({ 
            opacity: 1, 
            y: 0, 
            transition: { 
              duration: 0.5, 
              delay: delay + i * staggerDelay,
              ease: [0.22, 1, 0.36, 1]
            }
          })
        };
    }
  };
  
  return (
    <Box ref={ref}>
      {React.Children.map(children, (child, i) => (
        <motion.div
          custom={i}
          initial="hidden"
          animate={controls}
          variants={getVariants()}
        >
          {child}
        </motion.div>
      ))}
    </Box>
  );
};

// Magnetic button effect
interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
}

export const MagneticElement: React.FC<MagneticProps> = ({ children, strength = 30 }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const element = ref.current;
    if (!element) return;
    
    const { left, top, width, height } = element.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    element.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
  };
  
  const handleMouseLeave = () => {
    const element = ref.current;
    if (!element) return;
    
    element.style.transform = 'translate(0, 0)';
    element.style.transition = 'transform 0.5s ease';
  };
  
  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-block' }}
    >
      {children}
    </div>
  );
};

// 3D Tilt Card
interface TiltCardProps {
  children: React.ReactNode;
  intensity?: number;
  perspective?: number;
  scale?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({ 
  children, 
  intensity = 10, 
  perspective = 1000,
  scale = 1.05
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;
    
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    const rotateX = intensity * (0.5 - y / height);
    const rotateY = intensity * (x / width - 0.5);
    
    card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
  };
  
  const handleMouseLeave = () => {
    const card = ref.current;
    if (!card) return;
    
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s ease';
  };
  
  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease'
      }}
    >
      {children}
    </div>
  );
};

// Decorative grid background
export const GridBackground: React.FC<{color?: string, size?: number, opacity?: number}> = ({ 
  color = '#000', 
  size = 40,
  opacity = 0.03
}) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(to right, ${color} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

// Marquee text animation
interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  reverse?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({ children, speed = 20, reverse = false }) => {
  return (
    <Box sx={{ 
      width: '100%', 
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      position: 'relative'
    }}>
      <Box sx={{ 
        display: 'inline-block',
        animation: `marquee ${speed}s linear infinite ${reverse ? 'reverse' : ''}`,
        '@keyframes marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      }}>
        {children}
        {children}
      </Box>
    </Box>
  );
};

// Lottie animation wrapper
interface LottieWrapperProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  width?: string | number;
  height?: string | number;
}

export const LottieWrapper: React.FC<LottieWrapperProps> = ({ 
  animationData, 
  loop = true, 
  autoplay = true,
  width = '100%',
  height = '100%'
}) => {
  const lottieRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // This is a placeholder - in a real implementation you would import Lottie from lottie-web
    // or use react-lottie and initialize it here
    console.log('Lottie animation would play here with data:', animationData);
  }, [animationData]);
  
  return (
    <div 
      ref={lottieRef} 
      style={{ width, height }}
    />
  );
};

// Glass morphism card or container
interface GlassMorphProps {
  children: React.ReactNode;
  blur?: number;
  opacity?: number;
  borderColor?: string;
}

export const GlassMorph: React.FC<GlassMorphProps> = ({ 
  children, 
  blur = 10,
  opacity = 0.1,
  borderColor
}) => {
  const theme = useTheme();
  const border = borderColor || theme.palette.primary.main;
  
  return (
    <Box
      sx={{
        background: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        borderRadius: 2,
        border: `1px solid ${alpha(border, 0.2)}`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${alpha(border, 0.3)}, transparent)`,
        }
      }}
    >
      {children}
    </Box>
  );
};

// Noise texture overlay
export const NoiseOverlay: React.FC<{opacity?: number}> = ({ opacity = 0.05 }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        opacity,
        pointerEvents: 'none',
        zIndex: 1,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

// Gradient background with animated wave
export const AnimatedGradient: React.FC<{colorStart?: string, colorEnd?: string}> = ({ 
  colorStart, 
  colorEnd 
}) => {
  const theme = useTheme();
  const start = colorStart || theme.palette.primary.light;
  const end = colorEnd || theme.palette.primary.dark;
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(120deg, ${start}, ${end})`,
        backgroundSize: '400% 400%',
        animation: 'gradientAnimation 15s ease infinite',
        '@keyframes gradientAnimation': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        zIndex: -1,
      }}
    />
  );
};

// Export all components
export default {
  CustomCursor,
  ParallaxSection,
  TextReveal,
  StaggerReveal,
  MagneticElement,
  TiltCard,
  GridBackground,
  Marquee,
  LottieWrapper,
  GlassMorph,
  NoiseOverlay,
  AnimatedGradient
}; 