import { useState, useEffect } from 'react';
import { AuthModal } from './AuthModal';
import { useAuth } from '../contexts/AuthContext';

const PROMPT_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'];

export function AuthPrompt() {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());

  useEffect(() => {
    // Don't show prompt if already authenticated
    if (isAuthenticated) {
      return;
    }

    // Track user activity
    const handleActivity = () => {
      setLastActivityTime(Date.now());
    };

    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Check every minute if we should show the prompt
    const intervalId = setInterval(() => {
      if (!isAuthenticated) {
        const timeSinceLastActivity = Date.now() - lastActivityTime;
        
        // Only show if user has been active in the last 30 seconds
        // and 5 minutes have passed since last activity time tracked
        if (timeSinceLastActivity >= PROMPT_INTERVAL) {
          setShowModal(true);
          setLastActivityTime(Date.now()); // Reset timer
        }
      }
    }, 60000); // Check every minute

    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(intervalId);
    };
  }, [isAuthenticated, lastActivityTime]);

  // Force close modal when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      setShowModal(false);
    }
  }, [isAuthenticated]);

  return (
    <AuthModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      defaultMode="signup"
    />
  );
}
