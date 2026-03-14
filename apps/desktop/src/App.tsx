import { Routes, Route, Navigate } from 'react-router-dom';
import { DesktopLayout } from './layouts/DesktopLayout';
import { CollectPage } from './pages/CollectPage';
import { SessionPage } from './pages/SessionPage';
import { EpisodesPage } from './pages/EpisodesPage';
import { EpisodeDetailPage } from './pages/EpisodeDetailPage';
import { SyncPage } from './pages/SyncPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<DesktopLayout />}>
        <Route index element={<Navigate to="/collect" replace />} />
        <Route path="collect" element={<CollectPage />} />
        <Route path="session/:sessionId" element={<SessionPage />} />
        <Route path="episodes" element={<EpisodesPage />} />
        <Route path="episodes/:episodeId" element={<EpisodeDetailPage />} />
        <Route path="sync" element={<SyncPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
