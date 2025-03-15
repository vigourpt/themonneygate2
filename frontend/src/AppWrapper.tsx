import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'components/Toast';
import { SomethingWentWrongPage } from 'components/SomethingWentWrongPage';
import { Home } from 'components/Home';
import { ToolGenerator } from 'components/ToolGenerator';
import { ToolMonetization } from 'components/ToolMonetization';
import { GeneratedTools } from 'components/GeneratedTools';
import { Login } from 'components/Login';
import { Logout } from 'components/Logout';
import { Profile } from 'components/Profile';
import { Subscription } from 'components/Subscription';
import { Contact } from 'components/Contact';
import { Terms } from 'components/Terms';
import { About } from 'components/About';
import { AdminDashboard } from 'components/AdminDashboard';
import { Blog } from 'components/Blog';
import { Guides } from 'components/Guides';
import { KeywordResearch } from 'components/KeywordResearch';
import { NotFoundPage } from 'components/NotFoundPage';

const AppWrapper: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={SomethingWentWrongPage}>
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tool-generator" element={<ToolGenerator />} />
          <Route path="/tool-monetization" element={<ToolMonetization />} />
          <Route path="/generated-tools" element={<GeneratedTools />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/keyword-research" element={<KeywordResearch />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default AppWrapper;