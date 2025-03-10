
import React from 'react';
import { Route } from 'react-router-dom';
import SecurityControlsPage from '@/pages/SecurityControls';

export const SecurityRoutes: React.FC = () => {
  return (
    <Route path="/security-controls" element={<SecurityControlsPage />} />
  );
};
