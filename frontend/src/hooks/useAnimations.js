import React, { useEffect, useRef, useState } from 'react';

/**
 * Hook for scroll animations
 * Triggers animation when element enters viewport
 */
export const useScrollAnimation = (options = {}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.once) {
            observer.unobserve(entry.target);
          }
        } else if (!options.once) {
          setIsVisible(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [options.once, options.threshold, options.rootMargin]);

  return [elementRef, isVisible];
};

/**
 * Animated component wrapper
 * Usage: <AnimateOnScroll animation="fade-in-up">content</AnimateOnScroll>
 */
export const AnimateOnScroll = ({ 
  children, 
  animation = 'fade-in-up', 
  delay = 0,
  once = true,
  className = ''
}) => {
  const [ref, isVisible] = useScrollAnimation({ once });

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${isVisible ? 'visible' : ''} ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationName: isVisible ? animation : 'none'
      }}
    >
      {children}
    </div>
  );
};

/**
 * Stagger children animations
 * Usage: <StaggerChildren delay={100}>{children}</StaggerChildren>
 */
export const StaggerChildren = ({ children, delay = 100, className = '' }) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <AnimateOnScroll delay={index * delay}>
          {child}
        </AnimateOnScroll>
      ))}
    </div>
  );
};

/**
 * Page transition wrapper
 */
export const PageTransition = ({ children }) => {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
};

export default { useScrollAnimation, AnimateOnScroll, StaggerChildren, PageTransition };