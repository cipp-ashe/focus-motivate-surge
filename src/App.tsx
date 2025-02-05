import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ComponentExamples from "./pages/ComponentExamples";
import { AppLayout } from "./components/AppLayout";
import { NotesPanelProvider } from "./hooks/useNotesPanel";

// Suppress specific React Router v7 warnings
window.__reactRouterFutureWarnings = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <NotesPanelProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/components" element={<ComponentExamples />} />
            </Routes>
          </AppLayout>
          <Toaster position="bottom-right" closeButton />
        </NotesPanelProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
