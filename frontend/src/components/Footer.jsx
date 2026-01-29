import React from 'react';
import { Github, Linkedin, Twitter, Dribbble, Heart, ArrowUp } from 'lucide-react';
import { useBootstrap } from '../context/BootstrapContext';

const Footer = () => {
  const { data } = useBootstrap();
  const personalInfo = data?.personalInfo ?? null;
  const navLinks = data?.navLinks ?? [];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 lg:py-20 grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          {personalInfo && (
            <div className="lg:col-span-1">
              <a href="#home" className="inline-block mb-6">
                <span className="font-display text-3xl font-bold text-white">
                  <span className="text-red-500">&lt;</span>
                  {personalInfo.nickname}
                  <span className="text-red-500">/&gt;</span>
                </span>
              </a>
              <p className="text-gray-400 leading-relaxed mb-6">
                {personalInfo.description}
              </p>
              <div className="flex gap-3">
                {personalInfo.socials?.github && (
                  <a
                    href={personalInfo.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-xl transition-all duration-300 group"
                  >
                    <Github className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                  </a>
                )}
                {personalInfo.socials?.linkedin && (
                  <a
                    href={personalInfo.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-xl transition-all duration-300 group"
                  >
                    <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                  </a>
                )}
                {personalInfo.socials?.twitter && (
                  <a
                    href={personalInfo.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-xl transition-all duration-300 group"
                  >
                    <Twitter className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                  </a>
                )}
                {personalInfo.socials?.dribbble && (
                  <a
                    href={personalInfo.socials.dribbble}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-xl transition-all duration-300 group"
                  >
                    <Dribbble className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.id || link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                  Web Development
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                  Software Engineering
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                  UI/UX Design
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                  Freelancing
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          {personalInfo && (
            <div>
              <h4 className="text-white font-semibold text-lg mb-6">Contact</h4>
              <ul className="space-y-3 mb-6">
                <li>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {personalInfo.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {personalInfo.phone}
                  </a>
                </li>
                <li>
                  <span className="text-gray-400">{personalInfo.location}</span>
                </li>
              </ul>

              <h4 className="text-white font-semibold text-lg mb-3">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={() => { window.location.hash = '#support'; }}
                    className="text-gray-400 hover:text-red-400 transition-colors text-left"
                  >
                    Support
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => { window.location.hash = '#terms'; }}
                    className="text-gray-400 hover:text-red-400 transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => { window.location.hash = '#refund-policy'; }}
                    className="text-gray-400 hover:text-red-400 transition-colors text-left"
                  >
                    Refund Policy
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © {currentYear} {personalInfo?.nickname || 'Gaurav'}. All rights reserved. Made with{' '}
            <Heart className="inline w-4 h-4 text-red-500 fill-red-500" /> in NYC
          </p>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="p-3 bg-red-600 hover:bg-red-700 rounded-full text-white transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
