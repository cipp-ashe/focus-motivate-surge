
import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import Timer from "./pages/Timer";
import Notes from "./pages/Notes";
import Habits from "./pages/Habits";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Settings from "./pages/Settings";
import VoiceNotes from "./pages/VoiceNotes";
import Screenshots from "./pages/Screenshots";
import { RequireAuth } from "./components/auth/RequireAuth";
import AppLayout from "./components/AppLayout";
import { ErrorBoundary } from "react-error-boundary";

// Create and export the router configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-4">We couldn't find the page you're looking for.</p>
        <a href="/" className="text-primary hover:underline">
          Return to homepage
        </a>
      </div>
    ),
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "tasks",
        element: (
          <RequireAuth requireAuth={false}>
            <Tasks />
          </RequireAuth>
        ),
      },
      {
        path: "timer",
        element: (
          <RequireAuth requireAuth={false}>
            <Timer />
          </RequireAuth>
        ),
      },
      {
        path: "notes",
        element: (
          <RequireAuth requireAuth={false}>
            <Notes />
          </RequireAuth>
        ),
      },
      {
        path: "habits",
        element: (
          <RequireAuth requireAuth={false}>
            <Habits />
          </RequireAuth>
        ),
      },
      {
        path: "voice-notes",
        element: (
          <RequireAuth requireAuth={false}>
            <VoiceNotes />
          </RequireAuth>
        ),
      },
      {
        path: "screenshots",
        element: (
          <RequireAuth requireAuth={false}>
            <Screenshots />
          </RequireAuth>
        ),
      },
      {
        path: "settings",
        element: (
          <RequireAuth requireAuth={false}>
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
