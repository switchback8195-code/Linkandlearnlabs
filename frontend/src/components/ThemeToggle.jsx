import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div 
        style={{
          position: 'relative',
          width: '24px',
          height: '24px'
        }}
      >
        <Sun 
          size={20} 
          color="var(--text-primary)"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: theme === 'light' ? 'translate(-50%, -50%) rotate(0deg) scale(1)' : 'translate(-50%, -50%) rotate(90deg) scale(0)',
            transition: 'all 0.3s ease',
            opacity: theme === 'light' ? 1 : 0
          }}
        />
        <Moon 
          size={20} 
          color="var(--text-primary)"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: theme === 'dark' ? 'translate(-50%, -50%) rotate(0deg) scale(1)' : 'translate(-50%, -50%) rotate(-90deg) scale(0)',
            transition: 'all 0.3s ease',
            opacity: theme === 'dark' ? 1 : 0
          }}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;