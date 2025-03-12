import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../contexts/LoadingContext';

/**
 * Custom hook to show loading animation during route transitions in a SPA
 * - Shows loader only during actual page transitions
 * - Minimum display time: 800ms for a smooth transition
 * - Maximum display time: 3000ms (3 seconds)
 */
const useRouteChangeLoader = () => {
  const location = useLocation();
  const [previousLocation, setPreviousLocation] = useState(location);
  const { showLoader, hideLoader } = useLoading();
  const maxTimeoutRef = useRef<number | undefined>(undefined);
  const minTimeoutRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  
  useEffect(() => {
    // Only show loader when the path changes
    if (location.pathname !== previousLocation.pathname) {
      // Record start time
      startTimeRef.current = Date.now();
      
      // Show loader when location changes
      showLoader();
      
      // Set a maximum time for the loader to be displayed (3 seconds)
      maxTimeoutRef.current = window.setTimeout(() => {
        hideLoader();
      }, 3000);
      
      // Set a minimum display time for the loader to ensure a smooth experience
      minTimeoutRef.current = window.setTimeout(() => {
        // We estimate the content has loaded by now
        // For a real implementation, you might want to use a more sophisticated approach
        // like checking for specific elements or data to be loaded
        hideLoader();
      }, 800);
      
      // Update previous location
      setPreviousLocation(location);
      
      // Clean up timers if component unmounts or route changes again
      return () => {
        if (maxTimeoutRef.current !== undefined) {
          window.clearTimeout(maxTimeoutRef.current);
        }
        if (minTimeoutRef.current !== undefined) {
          window.clearTimeout(minTimeoutRef.current);
        }
      };
    }
  }, [location, previousLocation, showLoader, hideLoader]);
};

export default useRouteChangeLoader;