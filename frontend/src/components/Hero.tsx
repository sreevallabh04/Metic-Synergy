import React, { useEffect, useState } from 'react';
import { Instagram, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HyperText } from '../registry/magicui/hyper-text';
import { TextAnimate } from '../registry/magicui/text-animate';
import { BoxReveal } from '../registry/magicui/box-reveal';
import Button from './Button';
import { Vortex } from '../ui/vortex';
import HomeForm from './HomeForm';

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
      <Vortex
        backgroundColor="black"
        className="w-full h-full min-h-screen flex items-center justify-center text-white pt-16 pb-8"
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
              <HyperText 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-serif"
                duration={30}
                delay={50}
                startOnView={true}
                animateOnHover={false}
              >
                METIC-SYNERGY
              </HyperText>
            </h1>
          </div>
          
          <div className={`max-w-2xl mx-auto mb-10 px-2 text-center transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>
            <TextAnimate 
  animation="blurInUp" 
  by="line" 
  once
  duration={30}
  className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-200"
>
  CRAFTING IMPACTFUL STORIES THROUGH DIGITAL MARKETING, PHOTOGRAPHY, AND CREATIVE AD SOLUTIONS.
</TextAnimate>

          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 text-sm sm:text-base transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>
            <a
              href="https://instagram.com/meticsynergy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
            >
              <Instagram className="mr-2 h-5 w-5" />
              <span>meticsynergy-insta</span>
            </a>
            <a
              href="mailto:meticsynergy@gmail.com"
              className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
            >
              <Mail className="mr-2 h-5 w-5" />
              <span>meticsynergy@gmail.com</span>
            </a>
            <div className="flex items-center text-gray-300">
              <MapPin className="mr-2 h-5 w-5" />
              <span>Hyderabad, India</span>
            </div>
          </div>

          <div className={`flex justify-center items-center transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>
            <div className="w-full md:w-auto">
              <HomeForm />
            </div>
          </div>
        </div>
      </Vortex>
    </section>
  );
};

export default Hero;