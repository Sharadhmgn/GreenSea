import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Stack, IconButton, useTheme, alpha } from '@mui/material';
import { LinkedIn, Twitter, Email } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { MagneticElement } from './AwwwardsEffects';

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  image: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
  variant?: 'default' | 'compact' | 'expanded';
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  index, 
  variant = 'default' 
}) => {
  const theme = useTheme();
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1]
      }
    })
  };
  
  const SocialButtons = () => (
    <Stack direction="row" spacing={1} mt={2}>
      {member.social?.linkedin && (
        <MagneticElement strength={40}>
          <IconButton 
            component="a" 
            href={member.social.linkedin} 
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
            aria-label="LinkedIn"
          >
            <LinkedIn />
          </IconButton>
        </MagneticElement>
      )}
      
      {member.social?.twitter && (
        <MagneticElement strength={40}>
          <IconButton 
            component="a" 
            href={member.social.twitter} 
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
            aria-label="Twitter"
          >
            <Twitter />
          </IconButton>
        </MagneticElement>
      )}
      
      {member.social?.email && (
        <MagneticElement strength={40}>
          <IconButton 
            component="a" 
            href={`mailto:${member.social.email}`}
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
            aria-label="Email"
          >
            <Email />
          </IconButton>
        </MagneticElement>
      )}
    </Stack>
  );
  
  // Compact variant (just image, name and position in a smaller card)
  if (variant === 'compact') {
    return (
      <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={cardVariants}
      >
        <Card 
          className="card-hover"
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 3,
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.1),
          }}
        >
          <Box className="image-zoom-container" sx={{ height: 220 }}>
            <CardMedia
              component="img"
              height="220"
              image={member.image}
              alt={member.name}
              className="image-zoom"
            />
          </Box>
          <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
            <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
              {member.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {member.position}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  // Expanded variant (with bio, more details)
  if (variant === 'expanded') {
    return (
      <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={cardVariants}
      >
        <Card 
          className="card-hover"
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 3,
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.1),
          }}
        >
          <Box className="image-zoom-container" sx={{ height: 300 }}>
            <CardMedia
              component="img"
              height="300"
              image={member.image}
              alt={member.name}
              className="image-zoom"
            />
          </Box>
          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h5" component="h3" fontWeight={700} gutterBottom>
              {member.name}
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="primary"
              fontWeight={500} 
              sx={{ mb: 2 }}
            >
              {member.position}
            </Typography>
            
            {member.bio && (
              <Typography variant="body1" color="text.secondary" paragraph>
                {member.bio}
              </Typography>
            )}
            
            <SocialButtons />
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  // Default variant
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
    >
      <Card 
        className="card-hover"
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 3,
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1),
        }}
      >
        <Box className="image-zoom-container" sx={{ height: 250 }}>
          <CardMedia
            component="img"
            height="250"
            image={member.image}
            alt={member.name}
            className="image-zoom"
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
            {member.name}
          </Typography>
          <Typography 
            variant="subtitle2" 
            color="primary"
            fontWeight={500} 
            sx={{ mb: 2 }}
          >
            {member.position}
          </Typography>
          
          {member.bio && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {member.bio.length > 120 ? `${member.bio.substring(0, 120)}...` : member.bio}
            </Typography>
          )}
          
          <SocialButtons />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TeamMemberCard; 