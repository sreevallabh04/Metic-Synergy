import React, { useState, useEffect, useRef } from 'react';
import Hero from '../components/Hero';
import { Check, Sparkles } from 'lucide-react';
import ClientMarquee from '../components/ClientMarquee';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { FlickeringGrid } from '../components/FlickeringGrid';

const Home: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      title: "Discover",
      description: "Understand your brand, goals, and audience.",
    },
    {
      title: "Strategize",
      description: "Create a tailored marketing plan.",
    },
    {
      title: "Execute",
      description: "Implement campaigns across platforms.",
    },
    {
      title: "Optimize",
      description: "Analyze performance and refine strategies.",
    },
    {
      title: "Grow",
      description: "Deliver consistent results and scale your brand.",
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startStepAnimation();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const startStepAnimation = () => {
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        setActiveStep(step);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 1000); // Change step every second
  };

  return (
    <div className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center text-white relative px-4 sm:px-6"
    style={{
      perspective: '1000px',
    }}>
      <FlickeringGrid color="#000000" className="absolute inset-0 z-[-1]" />
      <div className="transform-gpu w-full mx-auto max-w-7xl bg-black/50 rounded-lg p-4 sm:p-6 md:p-8" style={{
        transformStyle: 'preserve-3d',
        boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.8)', // Stronger shadow for depth
      }}>
        <Hero />

        {/* How We Work Section */}
        <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 px-2 sm:px-4 relative ripple">
          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 animate-gradient"></div>
          </div>

          <div className="container mx-auto relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-12 sm:mb-16 md:mb-24 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
            >
              HOW WE WORK
            </motion.h2>

            {/* Enhanced Progress Bar */}
            <div className="max-w-3xl mx-auto mb-12 relative mt-16">
              {/* Background line with dots */}
              <div className="h-1 bg-gray-800 rounded-full flex justify-between items-center">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={"w-4 h-4 rounded-full transition-all duration-500 absolute " +
                      (index <= activeStep ? 'bg-purple-500 animate-pulse' : 'bg-gray-700')}
                    style={{ left: `${(index * 100) / (steps.length - 1)}%`, transform: 'translateX(-50%)' }}
                  >
                    {/* Step number tooltip */}
                    <span
                      className={"absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-medium " +
                        (index <= activeStep ? 'text-purple-400' : 'text-gray-500')}
                    >
                      {index + 1}
                    </span>
                  </div>
                ))}
                {/* Animated progress line */}
                <div
                  className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 rounded-full absolute top-0 left-0 transition-all duration-1000"
                  style={{
                    width: `${(activeStep / (steps.length - 1)) * 100}%`,
                    boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)'
                  }}
                ></div>
              </div>
            </div>

            {/* Steps content - remains the same */}
            <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={"flex items-center gap-6 mb-8 transition-all duration-500 " + (index <= activeStep
                    ? 'opacity-100 transform translate-x-0'
                    : 'opacity-0 transform translate-x-[-50px]'
                  )}
                >
                  <div className={"w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 " +
                    (index <= activeStep
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg shadow-purple-500/30 animate-pulse'
                      : 'bg-gray-700'
                    )}
                  >
                    {index < activeStep ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-white font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className={"flex-1 p-6 rounded-xl transition-all duration-300 " +
                    (index === activeStep
                      ? 'bg-gray-800/50 border border-purple-500/20 shadow-lg shadow-purple-500/10'
                      : 'bg-gray-700'
                    )}
                  >
                    <h3 className="text-xl font-bold text-purple-400 mb-2">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

       {/* Innovative Solutions Section */}
        <section className="py-12 sm:py-16 md:py-20 px-2 sm:px-4 relative overflow-hidden ripple">
          {/* Enhanced background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 animate-gradient"></div>
          </div>

          <div className="container mx-auto relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-8 sm:mb-12 md:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
            >
              OUR INNOVATIVE SOLUTIONS
            </motion.h2>

            {/* Add glowing cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-xs sm:max-w-3xl md:max-w-4xl lg:max-w-6xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20 
                         hover:border-purple-500/50 transition-all duration-500 
                         hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full 
                             flex items-center justify-center mb-6 mx-auto group-hover:animate-pulse"
                >
                  <Sparkles className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-4">
                  Find Unique Selling Point
                </h3>
                <p className="text-gray-300 text-center">
                  Help startups identify what makes them unique by understanding their competitors and target audience. Build a clear, standout brand message around that uniqueness.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20 
                         hover:border-purple-500/50 transition-all duration-500 
                         hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full 
                             flex items-center justify-center mb-6 mx-auto group-hover:animate-pulse"
                >
                  <Sparkles className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-4">
                  Brand Messaging Guidelines
                </h3>
                <p className="text-gray-300 text-center">
                  Ensure all marketing materials share the same clear message by setting guidelines and sticking to them.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20 
                         hover:border-purple-500/50 transition-all duration-500 
                         hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full 
                             flex items-center justify-center mb-6 mx-auto group-hover:animate-pulse"
                >
                  <Sparkles className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-4">
                  Agile Marketing Approach
                </h3>
                <p className="text-gray-300 text-center">
                  Stay agile by monitoring market trends, analyzing data, and being open to trying new strategies to keep marketing effective.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Client Marquee */}
        <ClientMarquee />

        {/* Add a glowing CTA section */}
        <section className="py-12 sm:py-16 md:py-20 px-2 sm:px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"></div>
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Ready to Transform Your Digital Presence?
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-10 md:mb-12">
                Join the innovative brands that trust us with their digital success
              </p>
              <div className="flex justify-center">
                <Link
                  to="/book"
                  className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium transition duration-300 ease-out border-2 border-purple-500 rounded-full group"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease">
                    Book an Appointment
                  </span>
                  <span className="relative invisible">Book an Appointment</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
