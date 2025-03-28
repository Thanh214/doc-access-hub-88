import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import DocumentView from './pages/DocumentView';
import DocumentBrowser from './pages/DocumentBrowser';
import PricingPlans from './pages/PricingPlans';
import NotFound from './pages/NotFound';
import DocumentsCatalog from './pages/DocumentsCatalog';
import DocumentDemo from './pages/DocumentDemo';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isSignedIn } = useAuth();
  return isSignedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/documents" element={<DocumentsCatalog />} />
          <Route path="/document/:id" element={<DocumentView />} />
          <Route path="/document-demo/:id" element={<DocumentDemo />} />
          <Route path="/browse" element={<DocumentBrowser />} />
          <Route path="/pricing" element={<PricingPlans />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
