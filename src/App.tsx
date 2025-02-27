
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AppLayout } from "./components/AppLayout";
import { NotesPanelProvider } from "./hooks/useNotesPanel";
import { HabitsPanelProvider } from "./hooks/useHabitsPanel";
import { TaskProvider } from "./contexts/tasks/TaskContext";
import { HabitProvider } from "./contexts/habits/HabitContext";
import { NoteProvider } from "./contexts/notes/NoteContext";
import { ThemeProvider } from "next-themes";
import Habits from "./pages/Habits";
import Notes from "./pages/Notes";

// Suppress specific React Router v7 warnings
window.__reactRouterFutureWarnings = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const queryClient = new QueryClient();

// Use HashRouter for electron, BrowserRouter for web
const Router = window.electron ? HashRouter : BrowserRouter;

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TaskProvider>
          <HabitProvider>
            <NoteProvider>
              <TooltipProvider>
                <Router>
                  <NotesPanelProvider>
                    <HabitsPanelProvider>
                      <Routes>
                        <Route element={<AppLayout />}>
                          <Route path="/" element={<Index />} />
                          <Route path="/habits" element={<Habits />} />
                          <Route path="/notes" element={<Notes />} />
                        </Route>
                      </Routes>
                      <Toaster position="bottom-right" closeButton />
                    </HabitsPanelProvider>
                  </NotesPanelProvider>
                </Router>
              </TooltipProvider>
            </NoteProvider>
          </HabitProvider>
        </TaskProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
