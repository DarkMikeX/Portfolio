import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Products from "./components/Products";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import Checkout from "./components/Checkout";
import AdminLogin from "./components/AdminLogin";
import PaymentSuccess from "./components/PaymentSuccess";
import Support from "./components/Support";
import Terms from "./components/Terms";
import RefundPolicy from "./components/RefundPolicy";
import { BootstrapProvider } from "./context/BootstrapContext";
import { getAuthToken } from "./services/api";

function App() {
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    const syncView = () => {
      const hash = window.location.hash;
      if (hash === '#dashboard' || hash.startsWith('#dashboard')) {
        if (!getAuthToken()) {
          window.location.hash = '#admin-login';
          setCurrentView('admin-login');
          return;
        }
        setCurrentView('dashboard');
      } else if (hash === '#admin-login' || hash.startsWith('#admin-login')) {
        setCurrentView('admin-login');
      } else if (hash === '#payment-success' || hash.startsWith('#payment-success')) {
        setCurrentView('payment-success');
      } else if (hash === '#checkout' || hash.startsWith('#checkout')) {
        setCurrentView('checkout');
      } else if (hash === '#support' || hash.startsWith('#support')) {
        setCurrentView('support');
      } else if (hash === '#terms' || hash.startsWith('#terms')) {
        setCurrentView('terms');
      } else if (hash === '#refund-policy' || hash.startsWith('#refund-policy')) {
        setCurrentView('refund-policy');
      } else {
        setCurrentView('home');
      }
    };

    syncView();
    const handleHashChange = () => syncView();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // When we switch to main page, scroll to the section in the hash (e.g. #services)
  useEffect(() => {
    if (currentView !== 'home') return;
    const raw = window.location.hash || '#home';
    const id = raw.replace('#', '') || 'home';
    const t = setTimeout(() => {
      const el = document.getElementById(id) || document.querySelector(`#${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
    return () => clearTimeout(t);
  }, [currentView]);

  if (currentView === 'admin-login') {
    return (
      <div className="App bg-black min-h-screen">
        <Navbar />
        <AdminLogin />
        <Footer />
      </div>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <div className="App bg-black min-h-screen">
        <Navbar />
        <Dashboard />
        <Footer />
      </div>
    );
  }

  if (currentView === 'payment-success') {
    return (
      <div className="App bg-black min-h-screen">
        <Navbar />
        <PaymentSuccess />
        <Footer />
      </div>
    );
  }

  if (currentView === 'checkout') {
    return (
      <div className="App bg-black min-h-screen">
        <Navbar />
        <Checkout />
        <Footer />
      </div>
    );
  }

  if (currentView === 'support') {
    return (
      <div className="App bg-black min-h-screen">
        <Navbar />
        <Support />
        <Footer />
      </div>
    );
  }

  if (currentView === 'terms') {
    return (
      <div className="App bg-black min-h-screen">
        <Navbar />
        <Terms />
        <Footer />
      </div>
    );
  }

  if (currentView === 'refund-policy') {
    return (
      <div className="App bg-black min-h-screen">
        <Navbar />
        <RefundPolicy />
        <Footer />
      </div>
    );
  }

  return (
    <div className="App bg-black min-h-screen">
      <BootstrapProvider>
        <Navbar />
        <Hero />
        <Services />
        <Portfolio />
        <Products />
        <Testimonials />
        <Contact />
        <Footer />
      </BootstrapProvider>
    </div>
  );
}

export default App;
