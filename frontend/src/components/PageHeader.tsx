import React from 'react';
import { Box, Typography, Container, Breadcrumbs, Link, useTheme, alpha } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ParallaxSection, NoiseOverlay } from './AwwwardsEffects';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    name: string;
    href?: string;
  }>;
  backgroundImage?: string;
  fullHeight?: boolean;
  alignment?: 'left' | 'center' | 'right';
  overlay?: boolean;
  children?: React.ReactNode;
  decorative?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  backgroundImage,
  fullHeight = false,
  alignment = 'center',
  overlay = true,
  children,
  decorative = true
}) => {
  const theme = useTheme();
  
  const textAlign = alignment;
  const minHeight = fullHeight ? '80vh' : '320px';
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };
  
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: backgroundImage 
          ? undefined 
          : alpha(theme.palette.primary.main, 0.05),
        pt: { xs: 12, md: 16 },
        pb: { xs: 6, md: 10 },
      }}
    >
      {overlay && backgroundImage && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6))`,
            zIndex: 1,
          }}
        />
      )}
      
      {decorative && !backgroundImage && (
        <>
          <NoiseOverlay opacity={0.03} />
          
          {/* Decorative circles */}
          <Box
            sx={{
              position: 'absolute',
              width: { xs: '250px', md: '500px' },
              height: { xs: '250px', md: '500px' },
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.2)}, transparent)`,
              top: { xs: '-100px', md: '-150px' },
              right: { xs: '-100px', md: '-100px' },
              zIndex: 0,
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              width: { xs: '200px', md: '400px' },
              height: { xs: '200px', md: '400px' },
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.15)}, transparent)`,
              bottom: { xs: '-100px', md: '-150px' },
              left: { xs: '-100px', md: '-100px' },
              zIndex: 0,
            }}
          />
        </>
      )}
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {breadcrumbs && breadcrumbs.length > 0 && (
            <motion.div variants={itemVariants}>
              <Breadcrumbs
                aria-label="breadcrumb"
                sx={{
                  mb: 4,
                  '& .MuiBreadcrumbs-ol': {
                    justifyContent: textAlign === 'center' ? 'center' : 'flex-start',
                  },
                  '& .MuiBreadcrumbs-li': {
                    color: backgroundImage ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                  },
                  '& .MuiBreadcrumbs-separator': {
                    color: backgroundImage ? 'rgba(255, 255, 255, 0.5)' : 'text.disabled',
                  },
                }}
              >
                <Link
                  component={RouterLink}
                  to="/"
                  color={backgroundImage ? 'white' : 'inherit'}
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Home
                </Link>
                
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  
                  if (isLast || !crumb.href) {
                    return (
                      <Typography
                        key={index}
                        color={backgroundImage ? 'white' : 'text.primary'}
                        sx={{ fontWeight: isLast ? 500 : 400 }}
                      >
                        {crumb.name}
                      </Typography>
                    );
                  }
                  
                  return (
                    <Link
                      key={index}
                      component={RouterLink}
                      to={crumb.href}
                      color={backgroundImage ? 'white' : 'inherit'}
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {crumb.name}
                    </Link>
                  );
                })}
              </Breadcrumbs>
            </motion.div>
          )}
          
          <ParallaxSection direction="up" speed={0.5}>
            <motion.div variants={itemVariants}>
              <Typography
                component="h1"
                variant="h2"
                align={textAlign}
                gutterBottom
                sx={{
                  fontWeight: 800,
                  color: backgroundImage ? 'white' : 'text.primary',
                  mb: subtitle ? 2 : 4,
                  maxWidth: textAlign === 'center' ? '800px' : 'none',
                  mx: textAlign === 'center' ? 'auto' : 'initial',
                }}
              >
                {title}
              </Typography>
            </motion.div>
          </ParallaxSection>
          
          {subtitle && (
            <ParallaxSection direction="up" speed={0.7} offset={20}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h5"
                  align={textAlign}
                  sx={{
                    fontWeight: 400,
                    color: backgroundImage ? 'rgba(255, 255, 255, 0.9)' : 'text.secondary',
                    mb: 4,
                    maxWidth: textAlign === 'center' ? '700px' : 'none',
                    mx: textAlign === 'center' ? 'auto' : 'initial',
                    lineHeight: 1.6,
                  }}
                >
                  {subtitle}
                </Typography>
              </motion.div>
            </ParallaxSection>
          )}
          
          {children && (
            <motion.div variants={itemVariants} style={{ textAlign }}>
              {children}
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default PageHeader; 