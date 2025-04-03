import { useEffect, useRef, useState } from 'react';

/**
 * Hook for smooth revealing text character by character
 * @param text The text to reveal
 * @param duration Duration in ms
 * @param delay Initial delay in ms
 * @returns Object with text and isComplete
 */
export const useTextReveal = (text: string, duration = 1000, delay = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;
    
    timeout = setTimeout(() => {
      let currentIndex = 0;
      
      interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.substring(0, currentIndex));
          currentIndex++;
          
          if (currentIndex > text.length) {
            clearInterval(interval);
            setIsComplete(true);
          }
        }
      }, duration / text.length);
    }, delay);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, duration, delay]);
  
  return { text: displayedText, isComplete };
};

/**
 * Hook for creating a parallax scrolling effect
 * @param direction Direction of movement on scroll
 * @param speed Speed of parallax effect (1 = normal, 0.5 = half speed)
 * @returns Ref to attach to your element
 */
export const useParallax = (direction: 'up' | 'down' | 'left' | 'right' = 'up', speed = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    let startPos = 0;
    let rafId: number | null = null;
    
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const elementRect = element.getBoundingClientRect();
      
      // Calculate when element is in view
      const isInView = 
        elementRect.top < windowHeight &&
        elementRect.bottom > 0;
      
      if (isInView) {
        const relativePos = (scrollPos - startPos) * speed;
        
        // Apply transform based on direction
        switch (direction) {
          case 'up':
            element.style.transform = `translateY(-${relativePos}px)`;
            break;
          case 'down':
            element.style.transform = `translateY(${relativePos}px)`;
            break;
          case 'left':
            element.style.transform = `translateX(-${relativePos}px)`;
            break;
          case 'right':
            element.style.transform = `translateX(${relativePos}px)`;
            break;
        }
      }
      
      // Continue animation loop
      rafId = requestAnimationFrame(handleScroll);
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startPos = window.scrollY;
          rafId = requestAnimationFrame(handleScroll);
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    });
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [direction, speed]);
  
  return ref;
};

/**
 * Hook for creating a magnetic hover effect on elements
 * @param strength Strength of the magnetic effect (lower = stronger)
 * @returns Object with ref to attach to your element and props to spread
 */
export const useMagneticEffect = (strength = 25) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = e.clientX - (left + width / 2);
      const y = e.clientY - (top + height / 2);
      
      setPosition({ x: x / strength, y: y / strength });
    };
    
    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };
    
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);
  
  const props = {
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: position.x === 0 && position.y === 0 ? 'transform 0.5s ease' : 'none',
    },
  };
  
  return { ref: elementRef, props };
};

/**
 * Hook for creating a button with liquid effect
 * @returns Ref to attach to your button
 */
export const useLiquidButton = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      button.style.setProperty('--x', x.toString());
      button.style.setProperty('--y', y.toString());
    };
    
    button.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return buttonRef;
};

/**
 * Hook for creating a 3D tilt effect on hover
 * @param intensity How strong the tilt effect is
 * @param perspective Perspective value for 3D effect
 * @param scale Scale factor on hover
 * @returns Ref to attach to your element
 */
export const useTiltEffect = (intensity = 15, perspective = 1000, scale = 1.05) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      const rotateX = intensity * (0.5 - y / height);
      const rotateY = intensity * (x / width - 0.5);
      
      element.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    };
    
    const handleMouseLeave = () => {
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      element.style.transition = 'transform 0.5s ease';
    };
    
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity, perspective, scale]);
  
  return elementRef;
};

/**
 * Hook for creating a scroll-triggered animation
 * @param threshold Visibility threshold to trigger animation
 * @param rootMargin Root margin for Intersection Observer
 * @returns Object with ref and inView status
 */
export const useScrollAnimation = (threshold = 0.1, rootMargin = '0px') => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);
  
  return { ref, inView };
};

/**
 * Hook for smooth scrolling to an element
 * @param options Scrolling options
 * @returns Function to call with target element ID
 */
export const useSmoothScroll = (options = { behavior: 'smooth' as ScrollBehavior, block: 'start' as ScrollLogicalPosition }) => {
  const scrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView(options);
    }
  };
  
  return scrollTo;
};

/**
 * Hook for creating a mouse trail effect
 * @param color Trail color
 * @param size Dot size
 * @param maxTrail Max number of dots in trail
 */
export const useMouseTrail = (color = '#356648', size = 10, maxTrail = 20) => {
  useEffect(() => {
    const trail: HTMLDivElement[] = [];
    let mouseX = 0;
    let mouseY = 0;
    
    const createTrailDot = () => {
      const dot = document.createElement('div');
      dot.className = 'mouse-trail-dot';
      dot.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background-color: ${color};
        pointer-events: none;
        z-index: 9999;
        opacity: 0.7;
        transition: opacity 0.5s ease;
        transform: translate(-50%, -50%);
      `;
      
      document.body.appendChild(dot);
      return dot;
    };
    
    const updateTrail = () => {
      while (trail.length < maxTrail) {
        trail.push(createTrailDot());
      }
      
      // Update positions with decreasing opacity
      trail.forEach((dot, i) => {
        const delay = i * 3;
        setTimeout(() => {
          dot.style.left = `${mouseX}px`;
          dot.style.top = `${mouseY}px`;
          dot.style.opacity = (1 - i / maxTrail).toString();
        }, delay);
      });
      
      requestAnimationFrame(updateTrail);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    updateTrail();
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      trail.forEach(dot => {
        if (dot.parentNode) {
          dot.parentNode.removeChild(dot);
        }
      });
    };
  }, [color, size, maxTrail]);
};

export default {
  useTextReveal,
  useParallax,
  useMagneticEffect,
  useLiquidButton,
  useTiltEffect,
  useScrollAnimation,
  useSmoothScroll,
  useMouseTrail
}; 