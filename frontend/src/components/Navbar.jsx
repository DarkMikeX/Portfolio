import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { getNavLinks, getAuthToken } from '../services/api';
import { useBootstrap } from '../context/BootstrapContext';

const DEFAULT_NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Products", href: "#products" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [fallbackLinks, setFallbackLinks] = useState(DEFAULT_NAV_LINKS);
  const [showDashboard, setShowDashboard] = useState(() => !!getAuthToken());
  const { data, loading } = useBootstrap();
  const navLinks = data?.navLinks?.length ? data.navLinks : fallbackLinks;

  useEffect(() => {
    if (loading || data?.navLinks?.length) return;
    getNavLinks().then((res) => setFallbackLinks(Array.isArray(res) ? res : DEFAULT_NAV_LINKS)).catch(() => {});
  }, [loading, data?.navLinks]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const syncDashboard = () => setShowDashboard(!!getAuthToken());
    syncDashboard();
    window.addEventListener('hashchange', syncDashboard);
    return () => window.removeEventListener('hashchange', syncDashboard);
  }, []);

  // From Dashboard/Admin/Checkout/Success we must go to main page first, then scroll
  const isMainPage = () => {
    const h = window.location.hash || '';
    return !h.startsWith('#dashboard') && !h.startsWith('#admin-login') &&
           !h.startsWith('#checkout') && !h.startsWith('#payment-success');
  };

  const handleNavClick = (href) => {
    setIsOpen(false);
    if (href === '#dashboard' || href === '#admin-login') {
      window.location.hash = href;
      return;
    }
    // Section links: always set hash so we switch to main page from any view
    window.location.hash = href;
    if (isMainPage()) {
      requestAnimationFrame(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-red-900/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="font-display text-3xl font-bold text-white tracking-tight hover:text-red-500 transition-colors"
            >
              <span className="text-red-500">&lt;</span>
              Gaurav
              <span className="text-red-500">/&gt;</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-red-500/10 rounded-full transition-all duration-300 relative group"
              >
                {link.label}
                <span className="absolute inset-x-4 -bottom-0 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ))}
            {showDashboard ? (
              <a
                href="#dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '#dashboard';
                }}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-red-500/10 rounded-full transition-all duration-300 relative group"
              >
                Dashboard
              </a>
            ) : (
              <a
                href="#admin-login"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '#admin-login';
                }}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-red-500/10 rounded-full transition-all duration-300 relative group"
              >
                Admin
              </a>
            )}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="ml-4 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105"
            >
              Hire Me
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-20 bg-black/95 backdrop-blur-xl transition-all duration-500 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="text-2xl font-medium text-gray-300 hover:text-red-500 transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {link.label}
            </a>
          ))}
          {showDashboard ? (
            <a
              href="#dashboard"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
                window.location.hash = '#dashboard';
              }}
              className="text-2xl font-medium text-gray-300 hover:text-red-500 transition-colors"
            >
              Dashboard
            </a>
          ) : (
            <a
              href="#admin-login"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
                window.location.hash = '#admin-login';
              }}
              className="text-2xl font-medium text-gray-300 hover:text-red-500 transition-colors"
            >
              Admin
            </a>
          )}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="mt-4 px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold rounded-full transition-all duration-300 shadow-lg shadow-red-500/25"
          >
            Hire Me
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
