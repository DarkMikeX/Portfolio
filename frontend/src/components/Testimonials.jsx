import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { testimonials } from '../data/mock';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section id="testimonials" className="relative py-24 lg:py-32 bg-gradient-to-b from-black via-zinc-950 to-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            What Clients{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
              Say
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Don't just take my word for it. Here's what my clients have to say about working with me.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="relative">
            <div className="relative p-8 lg:p-12 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-white/10 rounded-3xl">
              {/* Quote Icon */}
              <div className="absolute -top-6 left-8 lg:left-12">
                <div className="p-4 bg-red-600 rounded-2xl shadow-lg shadow-red-500/30">
                  <Quote className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="pt-6">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed mb-8 italic">
                  "{testimonials[currentIndex].content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full border-2 border-red-500/50 object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-red-400 text-sm">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </div>

              {/* Red Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20 rounded-3xl blur-xl opacity-50" />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => {
                prevSlide();
                setIsAutoPlaying(false);
              }}
              className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-full text-gray-400 hover:text-white transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? 'bg-red-500 w-8'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                nextSlide();
                setIsAutoPlaying(false);
              }}
              className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-full text-gray-400 hover:text-white transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* All Testimonials Preview */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => goToSlide(index)}
              className={`p-4 text-left rounded-2xl border transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-red-500/10 border-red-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h5 className="text-sm font-medium text-white">{testimonial.name}</h5>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
