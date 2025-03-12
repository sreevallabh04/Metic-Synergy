import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './components/Portfolio';
import Contact from './pages/Contact';
import Book from './pages/Book';
import { BookingProvider } from './contexts/BookingContext';
import BookingModal from './components/BookingModal';
import DigitalMarketing from './pages/services/DigitalMarketing';
import Photography from './pages/services/Photography';
import Videography from './pages/services/Videography';
import BrandDevelopment from './pages/services/BrandDevelopment';
import SocialMedia from './pages/services/SocialMedia';
import ContentCreation from './pages/services/ContentCreation';
import Survey from './pages/Survey';
import VideoPage from './pages/VideoPage';

function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="min-h-screen bg-black text-white" style={{ perspective: '1000px' }}>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/book" element={<Book />} />
              <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
              <Route path="/services/photography" element={<Photography />} />
              <Route path="/services/videography" element={<Videography />} />
              <Route path="/services/brand-development" element={<BrandDevelopment />} />
              <Route path="/services/social-media" element={<SocialMedia />} />
              <Route path="/services/content-creation" element={<ContentCreation />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/video" element={<VideoPage />} />
            </Routes>
          </main>
          <Footer />
          <BookingModal />
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;