
import React from "react";
import {
  createBrowserRouter,
} from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import Layout from "@/components/layout/Layout";

const Home = React.lazy(() => import("./pages/Home"));
const Index = React.lazy(() => import("./pages/Index"));
const Timer = React.lazy(() => import("./pages/Timer"));
const Tasks = React.lazy(() => import("./pages/Tasks"));
const Habits = React.lazy(() => import("./pages/Habits"));
const Journal = React.lazy(() => import("./pages/Journal"));
const Notes = React.lazy(() => import("./pages/Notes"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Metrics = React.lazy(() => import("./pages/Metrics"));
const Auth = React.lazy(() => import("./pages/Auth"));
const AuthCallback = React.lazy(() => import("./pages/AuthCallback"));

const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Index />
          </React.Suspense>
        </Layout>
      </RequireAuth>
    ),
  },
  {
    path: "/home",
    element: (
      <RequireAuth>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Home />
          </React.Suspense>
        </Layout>
      </RequireAuth>
    ),
  },
  {
    path: "/auth",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Auth />
      </React.Suspense>
    ),
  },
  {
    path: "/auth/callback",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <AuthCallback />
      </React.Suspense>
    ),
  },
  {
    path: "/timer",
    element: (
      <RequireAuth>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Timer />
          </React.Suspense>
        </Layout>
      </RequireAuth>
    ),
  },
  {
    path: "/tasks",
    element: (
      <RequireAuth>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Tasks />
          </React.Suspense>
        </Layout>
      </RequireAuth>
    ),
  },
  {
    path: "/habits",
    element: (
      <RequireAuth>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Habits />
          </React.Suspense>
        </Layout>
      </RequireAuth>
    ),
  },
  {
    path: "/journal",
    element: (
      <RequireAuth>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Journal />
          </React.Suspense>
        </Layout>
      </RequireAuth>
    ),
  },
  {
    path: "/notes",
    element: (
      <RequireAuth>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Notes />
          </React.Suspense>
        </Layout>
      </RequireAuth>
    ),
  },
  {
    path: "/settings",
    element: (
      <RequireAuth>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Settings />
          </React.Suspense>
        </Layout>
      </RequireAuth>
    ),
  },
  {
    path: "/metrics",
    element: (
      <RequireAuth>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Metrics />
          </React.Suspense>
        </Layout>
      </RequireAuth>
    ),
  },
]);

export default Router;
