import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface WaveEffectProps {
  color?: string;
  height?: number;
  amplitude?: number;
  frequency?: number;
  speed?: number;
}

/**
 * Canvas-based wave animation effect
 */
export const WaveEffect: React.FC<WaveEffectProps> = ({
  color = '#356648',
  height = 100,
  amplitude = 20,
  frequency = 0.01,
  speed = 0.05
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Setup canvas dimensions
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = height;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Animation variables
    let phase = 0;
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      
      // Start at the left side, below canvas bottom (to fill completely)
      ctx.moveTo(0, canvas.height + 10);
      
      // Draw the wave across the canvas width
      for (let x = 0; x < canvas.width; x++) {
        // Multiple sine waves for more complex effect
        const y = amplitude * Math.sin(x * frequency + phase) + 
                 (amplitude * 0.5) * Math.sin(x * frequency * 2 + phase * 1.5);
        
        // Position the wave near the bottom of the canvas
        ctx.lineTo(x, canvas.height - height / 3 + y);
      }
      
      // Complete the path to fill the wave
      ctx.lineTo(canvas.width, canvas.height + 10);
      ctx.closePath();
      
      ctx.fillStyle = color;
      ctx.fill();
      
      // Advance the phase for animation
      phase += speed;
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [color, height, amplitude, frequency, speed]);
  
  return (
    <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height, overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </Box>
  );
};

interface ParticleNetworkProps {
  particleColor?: string;
  lineColor?: string;
  particleAmount?: number;
  defaultRadius?: number;
  variantRadius?: number;
  defaultSpeed?: number;
  variantSpeed?: number;
  linkRadius?: number;
}

/**
 * Canvas-based particle network animation
 */
export const ParticleNetwork: React.FC<ParticleNetworkProps> = ({
  particleColor = 'rgba(53, 102, 72, 0.5)',
  lineColor = 'rgba(53, 102, 72, 0.2)',
  particleAmount = 50,
  defaultRadius = 3,
  variantRadius = 1,
  defaultSpeed = 0.5,
  variantSpeed = 0.5,
  linkRadius = 200
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize canvas to full screen
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      radius: number;
      speed: number;
      directionAngle: number;
      color: string;
      vector: { x: number; y: number };
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = defaultRadius + Math.random() * variantRadius;
        this.speed = defaultSpeed + Math.random() * variantSpeed;
        this.directionAngle = Math.random() * 2 * Math.PI;
        this.color = particleColor;
        this.vector = {
          x: Math.cos(this.directionAngle) * this.speed,
          y: Math.sin(this.directionAngle) * this.speed
        };
      }
      
      update() {
        // Change direction if particle reaches edges
        if (this.x > canvas.width || this.x < 0) {
          this.vector.x *= -1;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.vector.y *= -1;
        }
        
        // Update position
        this.x += this.vector.x;
        this.y += this.vector.y;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    
    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleAmount; i++) {
      particles.push(new Particle());
    }
    
    // Connect particles if they are close enough
    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          // Calculate distance between two particles
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < linkRadius) {
            // Set opacity based on distance
            const opacity = 1 - (distance / linkRadius);
            
            ctx.beginPath();
            ctx.strokeStyle = lineColor.replace(')', `, ${opacity})`).replace('rgba', 'rgba');
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      connectParticles();
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [particleColor, lineColor, particleAmount, defaultRadius, variantRadius, defaultSpeed, variantSpeed, linkRadius]);
  
  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </Box>
  );
};

interface GradientBackgroundProps {
  colors?: string[];
  speed?: number;
}

/**
 * Animated gradient background
 */
export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors = ['#356648', '#1a5f7a', '#4a7a5a'],
  speed = 10
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize canvas to full viewport
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Create gradient positions
    const gradientPoints = colors.map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed
    }));
    
    // Animation loop
    const animate = () => {
      // Update positions
      gradientPoints.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;
        
        // Bounce off edges
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
      });
      
      // Create gradient
      const gradient = ctx.createLinearGradient(
        gradientPoints[0].x, gradientPoints[0].y,
        gradientPoints[1].x, gradientPoints[1].y
      );
      
      colors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.length - 1), color);
      });
      
      // Draw gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [colors, speed]);
  
  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </Box>
  );
};

interface DistortionEffectProps {
  imageUrl: string;
  intensity?: number;
  speed?: number;
}

/**
 * Image distortion effect with mouse interaction
 */
export const DistortionEffect: React.FC<DistortionEffectProps> = ({
  imageUrl,
  intensity = 20,
  speed = 0.01
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Load image
    const image = new Image();
    image.src = imageUrl;
    imageRef.current = image;
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Wait for image to load
    image.onload = () => {
      let phase = 0;
      
      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate aspect ratio to cover the canvas
        const aspectRatio = image.width / image.height;
        const canvasAspectRatio = canvas.width / canvas.height;
        
        let drawWidth, drawHeight;
        
        if (canvasAspectRatio > aspectRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / aspectRatio;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * aspectRatio;
        }
        
        // Center the image
        const drawX = (canvas.width - drawWidth) / 2;
        const drawY = (canvas.height - drawHeight) / 2;
        
        // Apply distortion effect
        ctx.save();
        
        // Create distortion based on mouse position and phase
        for (let y = 0; y < canvas.height; y += 10) {
          // Calculate distortion amount
          const mouseDistY = Math.abs(mouseRef.current.y - y);
          const distortionY = Math.sin(phase + y * 0.01) * intensity;
          const distortionX = Math.cos(phase + y * 0.01) * intensity;
          
          // Apply mouse influence
          const mouseInfluence = Math.max(0, 1 - mouseDistY / 200);
          const finalDistortionX = distortionX * (1 + mouseInfluence);
          
          // Draw a slice of the image with distortion
          ctx.drawImage(
            image,
            0, (y / canvas.height) * image.height, image.width, 10, // Source slice
            drawX + finalDistortionX, drawY + y, drawWidth, 10 // Destination slice
          );
        }
        
        ctx.restore();
        
        // Update phase for animation
        phase += speed;
        
        requestRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    };
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [imageUrl, intensity, speed]);
  
  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </Box>
  );
};

export default {
  WaveEffect,
  ParticleNetwork,
  GradientBackground,
  DistortionEffect
}; 