import React from 'react';
import { Toaster } from 'components/Toaster';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { MainNavigation } from 'components/MainNavigation';
import { SideNavigation } from 'components/SideNavigation';
import { Outlet } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <SideNavigation />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <Toaster />
          {/* Main Content Goes Here */}
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;