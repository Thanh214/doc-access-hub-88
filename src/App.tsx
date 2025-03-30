import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DocumentBrowser from "@/pages/DocumentBrowser";
import DocumentView from "@/pages/DocumentView";
import PricingPlans from "@/pages/PricingPlans";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import Transactions from "@/pages/Transactions";
import AdminDashboard from "@/pages/AdminDashboard";
import { getCurrentUser } from "@/services/auth.service";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const UserRoute = ({ children }: { children: JSX.Element }) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <UserRoute>
                <Profile />
              </UserRoute>
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <UserRoute>
                <Transactions />
              </UserRoute>
            } 
          />
          
          <Route 
            path="/" 
            element={isAdmin ? <Navigate to="/admin" replace /> : <Index />} 
          />
          
          <Route path="/documents" element={<DocumentBrowser />} />
          <Route path="/documents/:id" element={<DocumentView />} />
          <Route path="/pricing" element={<PricingPlans />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
