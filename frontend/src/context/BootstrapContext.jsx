import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBootstrap } from '../services/api';

/** Show this immediately so all sections render content without waiting for the API. */
const DEFAULT_BOOTSTRAP = {
  personalInfo: {
    name: 'Michael Parker',
    nickname: 'Mikey',
    title: 'Full-Stack Developer',
    tagline: 'With great code comes great responsibility',
    description: 'A passionate developer swinging through the digital landscape, crafting exceptional web experiences with precision and creativity.',
    email: 'mikey@webdev.com',
    phone: '+1 (555) 123-4567',
    location: 'New York City, NY',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face',
    resume: '#',
    socials: { github: 'https://github.com', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com', dribbble: 'https://dribbble.com' },
  },
  stats: [
    { id: '1', value: '5+', label: 'Years Experience', order: 0 },
    { id: '2', value: '120+', label: 'Projects Completed', order: 1 },
    { id: '3', value: '50+', label: 'Happy Clients', order: 2 },
    { id: '4', value: '99%', label: 'Success Rate', order: 3 },
  ],
  navLinks: [
    { id: '1', label: 'Home', href: '#home', order: 0 },
    { id: '2', label: 'Services', href: '#services', order: 1 },
    { id: '3', label: 'Portfolio', href: '#portfolio', order: 2 },
    { id: '4', label: 'Products', href: '#products', order: 3 },
    { id: '5', label: 'Testimonials', href: '#testimonials', order: 4 },
    { id: '6', label: 'Contact', href: '#contact', order: 5 },
  ],
  services: [
    { id: '1', title: 'Web Development', description: 'Building responsive, high-performance websites with modern frameworks and best practices.', icon: 'Globe' },
    { id: '2', title: 'Software Engineering', description: 'Designing scalable software solutions with clean architecture and efficient algorithms.', icon: 'Code2' },
    { id: '3', title: 'UI/UX Design', description: 'Creating intuitive interfaces and seamless user experiences that captivate and convert.', icon: 'Palette' },
    { id: '4', title: 'Freelancing', description: 'Delivering custom solutions tailored to your unique business needs and goals.', icon: 'Briefcase' },
  ],
  projects: [
    { id: '1', title: 'E-Commerce Platform', description: 'A full-featured online store with payment integration and inventory management.', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop', category: 'Web Development', technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'], link: '#', github: '#' },
    { id: '2', title: 'Task Management App', description: 'A collaborative project management tool with real-time updates and team features.', image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop', category: 'Software Engineering', technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Socket.io'], link: '#', github: '#' },
    { id: '3', title: 'Finance Dashboard', description: 'Interactive analytics dashboard with data visualization and reporting features.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', category: 'UI/UX Design', technologies: ['React', 'D3.js', 'TailwindCSS', 'Chart.js'], link: '#', github: '#' },
    { id: '4', title: 'AI Chat Application', description: 'Intelligent conversational interface powered by machine learning algorithms.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop', category: 'Software Engineering', technologies: ['Python', 'FastAPI', 'OpenAI', 'Redis'], link: '#', github: '#' },
    { id: '5', title: 'Social Media App', description: 'Feature-rich social platform with real-time messaging and content sharing.', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop', category: 'Web Development', technologies: ['React Native', 'Firebase', 'GraphQL', 'AWS'], link: '#', github: '#' },
    { id: '6', title: 'Portfolio Generator', description: 'Dynamic portfolio builder with customizable templates and themes.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', category: 'Freelancing', technologies: ['Vue.js', 'Nuxt', 'Prisma', 'Vercel'], link: '#', github: '#' },
  ],
  products: [
    { id: '1', title: 'React Component Library', description: '50+ customizable UI components for rapid development.', price: 49, originalPrice: 79, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop', category: 'Code', rating: 4.9, downloads: 2500 },
    { id: '2', title: 'Full-Stack Starter Kit', description: 'Production-ready boilerplate with auth, API, and database.', price: 79, originalPrice: 129, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', category: 'Template', rating: 4.8, downloads: 1800 },
    { id: '3', title: 'Developer Icons Pack', description: '500+ premium icons optimized for web and mobile.', price: 29, originalPrice: 49, image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop', category: 'Design', rating: 4.7, downloads: 3200 },
    { id: '4', title: 'API Integration Guide', description: 'Comprehensive e-book on building robust API integrations.', price: 19, originalPrice: 39, image: 'https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=400&h=300&fit=crop', category: 'E-Book', rating: 4.9, downloads: 4100 },
  ],
  testimonials: [
    { id: '1', name: 'Sarah Johnson', role: 'CEO, TechStart Inc.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', content: 'Mikey delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise are unmatched.', rating: 5 },
    { id: '2', name: 'David Chen', role: 'Product Manager, InnovateCo', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', content: 'Working with Mikey was a game-changer for our project. He brought creative solutions and delivered ahead of schedule.', rating: 5 },
    { id: '3', name: 'Emily Rodriguez', role: 'Founder, DesignLab', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', content: 'The UI/UX work Mikey did for our app transformed our user engagement. Highly recommend his services!', rating: 5 },
    { id: '4', name: 'Marcus Thompson', role: 'CTO, DataFlow Systems', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', content: "Mikey's software engineering skills are top-notch. He built us a scalable solution that handles millions of requests.", rating: 5 },
  ],
  skills: [
    { id: '1', name: 'React / Next.js', level: 95 },
    { id: '2', name: 'Node.js / Express', level: 90 },
    { id: '3', name: 'TypeScript', level: 88 },
    { id: '4', name: 'Python / FastAPI', level: 85 },
    { id: '5', name: 'MongoDB / PostgreSQL', level: 87 },
    { id: '6', name: 'UI/UX Design', level: 82 },
  ],
};

const BootstrapContext = createContext({ data: null, loading: false, error: null });

export function BootstrapProvider({ children }) {
  const [data, setData] = useState(DEFAULT_BOOTSTRAP);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getBootstrap()
      .then((res) => {
        if (!cancelled && res) {
          setData(res);
        }
        if (!cancelled) setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || 'Failed to load');
          setData(DEFAULT_BOOTSTRAP);
        }
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <BootstrapContext.Provider value={{ data, loading, error }}>
      {children}
    </BootstrapContext.Provider>
  );
}

export function useBootstrap() {
  return useContext(BootstrapContext);
}
