import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AppLayout } from '@/layouts/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { CollectionPage } from '@/pages/CollectionPage';
import { ActiveSessionPage } from '@/pages/ActiveSessionPage';
import { EpisodesPage } from '@/pages/EpisodesPage';
import { EpisodeDetailPage } from '@/pages/EpisodeDetailPage';
import { MarketplacePage } from '@/pages/MarketplacePage';
import { DatasetDetailPage } from '@/pages/DatasetDetailPage';
import { CartPage } from '@/pages/CartPage';
import { MyDatasetsPage } from '@/pages/MyDatasetsPage';
import { CreateDatasetPage } from '@/pages/CreateDatasetPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ApiKeysPage } from '@/pages/ApiKeysPage';
import { AdminPage } from '@/pages/AdminPage';
import { FleetPage } from '@/pages/FleetPage';
import { PolicyPage } from '@/pages/PolicyPage';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />} />

      {/* Protected routes inside layout */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/collect" element={<CollectionPage />} />
        <Route path="/collect/:sessionId" element={<ProtectedRoute roles={['operator', 'admin']}><ActiveSessionPage /></ProtectedRoute>} />
        <Route path="/episodes" element={<EpisodesPage />} />
        <Route path="/episodes/:id" element={<EpisodeDetailPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/cart" element={<CartPage />} />
        <Route path="/marketplace/:id" element={<DatasetDetailPage />} />
        <Route path="/datasets" element={<MyDatasetsPage />} />
        <Route path="/datasets/new" element={<CreateDatasetPage />} />
        <Route path="/fleet" element={<FleetPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/api-keys" element={<ApiKeysPage />} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute>} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
