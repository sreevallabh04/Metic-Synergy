import React, { useState } from 'react';
import { FlickeringGrid } from '../components/FlickeringGrid';
import { Calendar, Clock, Mail, Phone, User, Building } from 'lucide-react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { useBooking } from '../contexts/BookingContext';

const Book: React.FC = () => {
  const { handleBookingSubmit, services } = useBooking();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    company: '',
    service: ''
  });
  const [dateTime, setDateTime] = useState<dayjs.Dayjs | null>(dayjs());
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!dateTime) {
      setError('Please select a date and time');
      return;
    }
    
    // Format date and time from the dateTime state
    const formattedData = {
      ...formData,
      date: dateTime.format('YYYY-MM-DD'),
      time: dateTime.format('HH:mm')
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }
  
      const result = await response.json();
      console.log(result);
      handleBookingSubmit(formData);
      setFormData({ name: '', phone: '', email: '', date: '', time: '', company: '', service: '' });
      setError(null);
    } catch (err) {
      console.error('Error submitting booking:', err);
      setError('Failed to submit booking. Please try again.');
    }
  };

  return (
    <div className="pt-16 sm:pt-20 px-4 sm:px-6 bg-cover bg-center min-h-screen flex flex-col items-center justify-center text-white relative"
    style={{
      perspective: '1000px',
    }}>
      <FlickeringGrid color="#000000" className="absolute inset-0 z-[-1]" />
      <div className="max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl w-full transform-gpu bg-black/50 p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg" style={{
        transformStyle: 'preserve-3d',
        boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.8)', // Stronger shadow for depth
      }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">Schedule a Call</h1>
        
        <StyledWrapper>
          <div className="form-container">
            {error && <div className="error-message">{error}</div>}
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">
                  <User className="icon" /> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">
                  <Mail className="icon" /> Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">
                  <Phone className="icon" /> Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="company">
                  <Building className="icon" /> Company/Business Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Enter your company or business name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="service">Service Required</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="date-time-picker-container">
                <label className="date-time-label">
                  <Calendar className="icon" /> Select Date and Time
                </label>
                <div className="date-time-picker-wrapper">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDateTimePicker
                      orientation="landscape"
                      value={dateTime}
                      onChange={(newValue) => setDateTime(newValue)}
                      slotProps={{
                        actionBar: { actions: [] },
                        toolbar: { hidden: false },
                      }}
                      sx={{
                        backgroundColor: "#212121",
                        color: "white",
                        borderRadius: "8px",
                        border: "1px solid #414141",
                        "& .MuiPickersDay-root": {
                          color: "white",
                        },
                        "& .MuiPickersDay-today": {
                          border: "1px solid #e81cff",
                        },
                        "& .MuiPickersDay-root.Mui-selected": {
                          backgroundColor: "#e81cff",
                        },
                        "& .MuiTypography-root": {
                          color: "white",
                        },
                        "& .MuiClock-pin": {
                          backgroundColor: "#e81cff",
                        },
                        "& .MuiClockPointer-root": {
                          backgroundColor: "#e81cff",
                        },
                        "& .MuiClockPointer-thumb": {
                          backgroundColor: "#e81cff",
                          borderColor: "#e81cff",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              
              <button className="form-submit-btn" type="submit">
                Schedule a call
              </button>
            </form>
          </div>
        </StyledWrapper>
      </div>
    </div>
  );
};



const StyledWrapper = styled.div`
  .form-container {
    width: 100%;
    background: linear-gradient(#212121, #212121) padding-box,
                linear-gradient(145deg, transparent 35%,#e81cff, #40c9ff) border-box;
    border: 2px solid transparent;
    padding: 32px 24px;
    font-size: 14px;
    font-family: inherit;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    border-radius: 16px;
  }

  .form-container button:active {
    scale: 0.95;
  }

  .form-container .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-container .form-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .date-time-picker-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .date-time-label {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    color: #717171;
    font-weight: 600;
    font-size: 12px;
  }

  .date-time-label .icon {
    width: 14px;
    height: 14px;
    margin-right: 6px;
  }

  .date-time-picker-wrapper {
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .form-container .form-group label {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    color: #717171;
    font-weight: 600;
    font-size: 12px;
  }

  .form-container .form-group label .icon {
    width: 14px;
    height: 14px;
    margin-right: 6px;
  }

  .form-container .form-group input,
  .form-container .form-group select {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    color: #fff;
    font-family: inherit;
    background-color: transparent;
    border: 1px solid #414141;
  }

  .form-container .form-group select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23717171' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
  }

  .form-container .form-group select option {
    background-color: #212121;
    color: #fff;
  }

  .form-container .form-group input::placeholder {
    opacity: 0.5;
  }

  .form-container .form-group input:focus,
  .form-container .form-group select:focus {
    outline: none;
    border-color: #e81cff;
  }

  .form-container .form-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    font-family: inherit;
    color: #fff;
    font-weight: 600;
    width: 100%;
    max-width: 300px;
    background: linear-gradient(145deg, #e81cff, #40c9ff);
    border: none;
    padding: 12px 16px;
    font-size: inherit;
    gap: 8px;
    margin-top: 16px;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .form-container .form-submit-btn:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(232, 28, 255, 0.4);
  }

  @media (max-width: 768px) {
    .date-time-container {
      flex-direction: column;
    }
  }
`;

export default Book;