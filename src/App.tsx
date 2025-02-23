
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
import { useTheme } from "@/hooks/useTheme";

// Suppress specific React Router v7 warnings
window.__reactRouterFutureWarnings = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const queryClient = new QueryClient();

// Use HashRouter for electron, BrowserRouter for web
const Router = window.electron ? HashRouter : BrowserRouter;

const App = () => {
  const { isDark } = useTheme(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TaskProvider>
        <HabitProvider>
          <NoteProvider>
            <TooltipProvider>
              <Router>
                <NotesPanelProvider>
                  <HabitsPanelProvider>
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                      </Routes>
                    </AppLayout>
                    <Toaster position="bottom-right" closeButton />
                  </HabitsPanelProvider>
                </NotesPanelProvider>
              </Router>
            </TooltipProvider>
          </NoteProvider>
        </HabitProvider>
      </TaskProvider>
    </QueryClientProvider>
  );
};

export default App;
