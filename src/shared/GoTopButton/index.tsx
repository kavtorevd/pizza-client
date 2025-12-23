'use client';

import { useState, useEffect } from 'react';
import styles from './styles.module.scss';

const GoTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Проверяем прокрутку
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > window.innerHeight * 0.9) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  if (!isVisible) {
    return null;
  }

  return (
    <button
      className={styles.goTopButton}
      onClick={scrollToTop}
      aria-label="Наверх"
      title="Наверх"
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M12 4L12 20M12 4L6 10M12 4L18 10" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default GoTopButton;