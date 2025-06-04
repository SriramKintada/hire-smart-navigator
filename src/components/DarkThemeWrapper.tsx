import React, { useEffect, useState } from 'react';

interface DarkThemeWrapperProps {
  children: React.ReactNode;
}

const DarkThemeWrapper: React.FC<DarkThemeWrapperProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Add dark class to html element to trigger dark mode via CSS framework
    document.documentElement.classList.add('dark');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // Clean up by removing the dark class
      document.documentElement.classList.remove('dark');
    };
  }, []);

  return (
    <div className="relative min-h-screen" style={{ overflow: 'hidden' }}>
      {/* Static Background Gradients */}
      <div className="pointer-events-none fixed inset-0">
        {/* Blue blur effect (top-right) */}
        <div
          className="absolute right-0 top-0 h-[500px] w-[500px]"
          style={{
            backgroundColor: 'hsl(217 91% 60% / 0.1)',
            filter: 'blur(100px)',
          }}
        ></div>
        {/* Purple blur effect (bottom-left) */}
        <div
          className="absolute bottom-0 left-0 h-[500px] w-[500px]"
          style={{
            backgroundColor: 'hsl(271 91% 65% / 0.1)',
            filter: 'blur(100px)',
          }}
        ></div>
      </div>

      {/* Cursor-Following Gradient */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background:
            `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      ></div>

      {children}
    </div>
  );
};

export default DarkThemeWrapper; 