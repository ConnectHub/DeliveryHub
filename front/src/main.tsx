import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import ResidentsPage from './pages/Residents/index.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/residents" element={<ResidentsPage />} />
  )
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
