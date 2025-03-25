import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import NotesPage from '@/pages/Notes';
import './index.css';
import './styles/animations.css';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/notes" element={<NotesPage />} />
      </Route>
    </Routes>
  );
};

export default App;
