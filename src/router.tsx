
import React from "react";
import {
  createBrowserRouter,
} from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import Layout from "@/components/layout/Layout";

const Home = React.lazy(() => import("./pages/Home"));
const Tasks = React.lazy(() => import("./pages/Tasks"));
const Habits = React.lazy(() => import("./pages/Habits"));
const Journal = React.lazy(() => import("./pages/Journal"));
const Notes = React.lazy(() => import("./pages/Notes"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Metrics = React.lazy(() => import("./pages/Metrics"));

const Router = createBrowserRouter([
  {
    path: "/",
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
