import React, { useState, useEffect } from 'react';

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleShowToast = (e) => {
      const { message, type = 'info' } = e.detail;
      setToast({ message, type, id: Date.now() });
      setTimeout(() => {
        setToast(null);
      }, 3000);
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => {
      window.removeEventListener('show-toast', handleShowToast);
    };
  }, []);

  if (!toast) {
    return null;
  }

  const baseStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 20px',
    borderRadius: '8px',
    color: 'white',
    zIndex: 1000,
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  };

  const typeStyles = {
    success: { backgroundColor: '#28a745' },
    error: { backgroundColor: '#dc3545' },
    info: { backgroundColor: '#17a2b8' },
  };

  return (
    <div style={{ ...baseStyle, ...typeStyles[toast.type] }}>
      {toast.message}
    </div>
  );
}