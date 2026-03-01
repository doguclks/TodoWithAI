import { Routes, Route } from 'react-router-dom';
import './App.css';
import TodoPage from './pages/TodoPage';
import Dashboard from './pages/Dashboard';
import { AppLayout } from './components/layout/AppLayout';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/todo/:id" element={<TodoPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
