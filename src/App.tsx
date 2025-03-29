import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DocumentBrowser from "@/pages/DocumentBrowser";
import DocumentView from "@/pages/DocumentView";
import PricingPlans from "@/pages/PricingPlans";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/documents" element={<DocumentBrowser />} />
          <Route path="/documents/:id" element={<DocumentView />} />
          <Route path="/pricing" element={<PricingPlans />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
