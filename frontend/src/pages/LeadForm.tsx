import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlickeringGrid } from '../components/FlickeringGrid';
import { BoxReveal } from '../registry/magicui/box-reveal';

interface FormData {
  name: string;
  email: string;
}

const LeadForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store form data in localStorage to access it on the survey and video page if needed
    localStorage.setItem('userFormData', JSON.stringify(formData));
    // Navigate to the survey page instead of directly to video
    navigate('/survey');
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: ''
    });
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-start text-white relative py-12 px-4">
      {/* Background effects */}
      <FlickeringGrid 
        color="#ffffff" 
        className="absolute inset-0 z-0" 
        maxOpacity={0.15}
        flickerChance={0.1}
      />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/90 z-1"></div>
      
      <div className="z-10 max-w-4xl mx-auto w-full">
        <div className="mb-10 mt-4">
          <BoxReveal boxColor="#5046e6" duration={0.6}>
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 py-2">
              Get Predictable Sales Appointments
            </h1>
          </BoxReveal>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <p className="text-gray-300 text-xl mb-2">
              Enter your details to get started
            </p>
            <p className="text-gray-400 text-sm">
              We'll show you how to get 10, 15, 30 or more predictable sales appointments each month
            </p>
          </div>
          
          <div className="w-full max-w-md mx-auto">
            <form 
              onSubmit={handleSubmit} 
              className="bg-gray-800/80 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 shadow-lg"
            >
              <div className="mb-4">
                <label htmlFor="name" className="block text-white font-medium mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  E-mail:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-between gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 shadow-lg shadow-green-500/30"
                >
                  Continue
                </button>
                <button
                  type="reset"
                  onClick={handleReset}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 shadow-lg shadow-red-500/30"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;