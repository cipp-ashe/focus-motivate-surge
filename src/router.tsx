
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Index from "./pages/Index";
import TaskPage from "./pages/TaskPage";
import Timer from "./pages/Timer";
import Notes from "./pages/Notes";
import Habits from "./pages/Habits";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Settings from "./pages/Settings";
import VoiceNotes from "./pages/VoiceNotes";
import Screenshots from "./pages/Screenshots";
import SecurityControlsPage from "./pages/SecurityControls";
import { RequireAuth } from "./components/auth/RequireAuth";

// Create and export the router configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "tasks",
        element: (
          <RequireAuth>
            <TaskPage />
          </RequireAuth>
        ),
      },
      {
        path: "timer",
        element: (
          <RequireAuth>
            <Timer />
          </RequireAuth>
        ),
      },
      {
        path: "notes",
        element: (
          <RequireAuth>
            <Notes />
          </RequireAuth>
        ),
      },
      {
        path: "habits",
        element: (
          <RequireAuth>
            <Habits />
          </RequireAuth>
        ),
      },
      {
        path: "voice-notes",
        element: (
          <RequireAuth>
            <VoiceNotes />
          </RequireAuth>
        ),
      },
      {
        path: "screenshots",
        element: (
          <RequireAuth>
            <Screenshots />
          </RequireAuth>
        ),
      },
      {
        path: "security-controls",
        element: (
          <RequireAuth>
            <SecurityControlsPage />
          </RequireAuth>
        ),
      },
      {
        path: "settings",
        element: (
          <RequireAuth>
            <Settings />
          </RequireAuth>
        ),
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "auth/callback",
        element: <AuthCallback />,
      },
    ],
  },
]);
