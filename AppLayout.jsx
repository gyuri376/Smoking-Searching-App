import React from 'react';
import Header from './Header';
// import BottomNav from './BottomNav'; // Example for future enhancement

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-content">
        {children}
      </main>
      {/* <BottomNav /> */}
    </div>
  );
}