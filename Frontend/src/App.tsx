import { Routes, Route } from 'react-router-dom';
import './App.css';
import TodoPage from './pages/TodoPage';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/routing/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/todo/:id" element={<AppLayout><TodoPage /></AppLayout>} />
      </Route>
    </Routes>
  );
}

export default App;
