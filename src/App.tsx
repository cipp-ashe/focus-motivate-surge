
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import NotesPage from '@/pages/Notes';
import './index.css';
import './styles/animations.css';

const App: React.FC = () => {
  console.log('App rendering');
  
  // Ensure our routes are properly configured
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<NotesPage />} />
        <Route path="/notes" element={<NotesPage />} />
      </Route>
    </Routes>
  );
};

export default App;
