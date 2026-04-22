import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { BookingProvider } from './contexts/BookingContext';
import { AuthProvider } from './contexts/AuthContext';
import { BackgroundMusic } from './components/BackgroundMusic';
import { DatabaseInitializer } from './components/DatabaseInitializer';
import { AuthPrompt } from './components/AuthPrompt';
import { Toaster } from 'sonner';

// Main App Component
export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookingProvider>
          <DatabaseInitializer />
          <RouterProvider router={router} />
          <BackgroundMusic />
          <AuthPrompt />
          <Toaster position="top-center" richColors />
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}