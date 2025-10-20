import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Admin from "./pages/Admin";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { initGA, trackPageView } from "./utils/analytics";

// Analytics wrapper component
function AnalyticsTracker({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname, document.title);
  }, [location]);

  return children;
}

function App() {
  useEffect(() => {
    // Initialize Google Analytics on app load
    initGA();
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <AnalyticsTracker>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
            <Footer />
            <Toaster />
          </AnalyticsTracker>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
