import { createBrowserRouter, Navigate } from 'react-router-dom';

import {
  AuthLayout,
  ClientPage,
  ClientsPage,
  ControlPanelPage,
  DailyCashPage,
  DashboardLayoutPage,
  HomePage,
  LoansPage,
  LoginForm,
  UsersPage
} from '../pages';
import { ProtectedRoute } from './ProtectedRoute';
import { CollectionRoute } from '../pages/loans';

export const router = createBrowserRouter( [
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/ingresar" replace />,
      },
      {
        path: 'ingresar',
        element: <LoginForm />,
      }
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute userStatus="authorized" role="user" redirectTo="/">
        <DashboardLayoutPage />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'clientes',
        element: <ClientsPage />,
      },
      {
        path: 'cliente/:id',
        element: <ClientPage />,
      },
      {
        path: 'caja',
        element: <DailyCashPage />,
      },
      {
        path: 'prestamos',
        element: <LoansPage />,
      },
      {
        path: 'cobranza',
        element: <CollectionRoute />,
      },
      {
        path: 'panel-de-control',
        element: <ControlPanelPage />,
      },
      {
        path: 'usuarios',
        element: (
          <ProtectedRoute userStatus="authorized" role="admin" redirectTo="/home">
            <UsersPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
] );
