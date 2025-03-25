
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import NotesPage from '@/pages/Notes';
import { DebugProvider } from '@/providers/DebugProvider';
import { DebugPanel } from '@/components/debug/DebugPanel';
import './index.css';
import './styles/animations.css';

const App: React.FC = () => {
  console.log('App rendering');
  
  return (
    <DebugProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<NotesPage />} />
          <Route path="/notes" element={<NotesPage />} />
        </Route>
      </Routes>
      <DebugPanel />
    </DebugProvider>
  );
};

export default App;
