import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextAnimate } from '../registry/magicui/text-animate';
import { BoxReveal } from '../registry/magicui/box-reveal';
import { FlipText } from '../registry/magicui/flip-text';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set visible after component mounts to trigger animations
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleBooking = () => {
    navigate('/book');
    // Scroll to booking section after a short delay to ensure the page has loaded
    setTimeout(() => {
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBookAppointment = () => {
    navigate('/book');
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div 
        className="w-full h-full min-h-screen flex flex-col justify-center text-white pt-16 pb-8"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="container">
            {/* Heading */}
            <div className="ml-6 md:ml-8 lg:ml-10 mb-12 text-left">
              <h1 className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                <FlipText className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold -tracking-wider text-white">
                  METIC-SYNERGY
                </FlipText>
              </h1>
            </div>
            
            {/* Tagline */}
            <div className={`ml-6 md:ml-8 lg:ml-10 mb-16 transition-opacity duration-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}>
              <TextAnimate 
                animation="blurInUp" 
                by="word" 
                once
                duration={20}
                className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-200 font-light tracking-wider"
              >
                CRAFTING IMPACTFUL STORIES THROUGH
                DIGITAL MARKETING & CREATIVE SOLUTIONS
              </TextAnimate>
            </div>

            {/* Button */}
            <div className={`ml-6 md:ml-8 lg:ml-10 transition-opacity duration-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}>
              <button 
                onClick={() => navigate('/lead-form')}
                className="py-4 px-12 text-lg font-medium rounded-none border-2 border-white 
                  bg-transparent hover:bg-white hover:text-black
                  text-white transition-all duration-500 transform hover:scale-105 hover:shadow-glow"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;