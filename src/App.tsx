
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import DocumentView from './pages/DocumentView';
import PricingPlans from './pages/PricingPlans';
import NotFound from './pages/NotFound';
import DocumentsCatalog from './pages/DocumentsCatalog';
import DocumentDemo from './pages/DocumentDemo';
import { useAuth } from './hooks/useAuth';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/documents" element={<DocumentsCatalog />} />
        <Route path="/document/:id" element={<DocumentView />} />
        <Route path="/document-demo/:id" element={<DocumentDemo />} />
        <Route path="/pricing" element={<PricingPlans />} />
        <Route path="/browse" element={<Navigate to="/documents" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
