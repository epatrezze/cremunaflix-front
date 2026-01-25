import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../ui/pages/HomePage';
import CatalogPage from '../ui/pages/CatalogPage';
import SessionsPage from '../ui/pages/SessionsPage';
import RequestsPage from '../ui/pages/RequestsPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/catalogo" element={<CatalogPage />} />
    <Route path="/sessoes" element={<SessionsPage />} />
    <Route path="/pedidos" element={<RequestsPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
