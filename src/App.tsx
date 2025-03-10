import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages';
import Timer from './pages/timer';
import Notes from './pages/notes';
import Habits from './pages/habits';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TaskProvider } from './contexts/tasks/TaskContext';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TaskProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/tasks" element={<React.lazy(() => import('./pages/TaskPage'))} />
          </Routes>
        </TaskProvider>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
