import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { personalInfo, skills } from '../data/mock';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('loading');
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus('idle'), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-800/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm font-medium mb-4">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Let's Work{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
              Together
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how we can bring your ideas to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info & Skills */}
          <div>
            {/* Contact Cards */}
            <div className="space-y-4 mb-10">
              <div className="group p-5 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-white/10 hover:border-red-500/50 rounded-2xl transition-all duration-300 flex items-center gap-4">
                <div className="p-3 bg-red-600/20 rounded-xl group-hover:bg-red-600 transition-colors">
                  <Mail className="w-6 h-6 text-red-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <a href={`mailto:${personalInfo.email}`} className="text-white hover:text-red-400 transition-colors">
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <div className="group p-5 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-white/10 hover:border-red-500/50 rounded-2xl transition-all duration-300 flex items-center gap-4">
                <div className="p-3 bg-red-600/20 rounded-xl group-hover:bg-red-600 transition-colors">
                  <Phone className="w-6 h-6 text-red-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Phone</p>
                  <a href={`tel:${personalInfo.phone}`} className="text-white hover:text-red-400 transition-colors">
                    {personalInfo.phone}
                  </a>
                </div>
              </div>

              <div className="group p-5 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-white/10 hover:border-red-500/50 rounded-2xl transition-all duration-300 flex items-center gap-4">
                <div className="p-3 bg-red-600/20 rounded-xl group-hover:bg-red-600 transition-colors">
                  <MapPin className="w-6 h-6 text-red-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Location</p>
                  <p className="text-white">{personalInfo.location}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">My Skills</h3>
              <div className="space-y-5">
                {skills.map((skill, index) => (
                  <div key={skill.name} style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300 text-sm font-medium">{skill.name}</span>
                      <span className="text-red-400 text-sm font-semibold">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative">
            <div className="p-8 lg:p-10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-white/10 rounded-3xl">
              {status === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400 text-center">Thanks for reaching out. I'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full px-5 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors ${
                        errors.name ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-red-400 text-sm">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`w-full px-5 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-red-400 text-sm">{errors.email}</p>}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project Inquiry"
                      className={`w-full px-5 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors ${
                        errors.subject ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                    {errors.subject && <p className="mt-1 text-red-400 text-sm">{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project..."
                      rows={5}
                      className={`w-full px-5 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors resize-none ${
                        errors.message ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                    {errors.message && <p className="mt-1 text-red-400 text-sm">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Red Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/10 via-transparent to-red-600/10 rounded-3xl blur-xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
