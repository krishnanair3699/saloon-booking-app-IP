import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-86f09702`;

export function DatabaseInitializer() {
  const [initialized, setInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        // Check if already initialized
        const alreadyInit = localStorage.getItem('db_initialized');
        if (alreadyInit) {
          console.log('Database already initialized (from localStorage)');
          setInitialized(true);
          return;
        }

        console.log('=== STARTING DATABASE INITIALIZATION ===');
        console.log('API_BASE:', API_BASE);
        console.log('Project ID:', projectId);
        console.log('Public Anon Key (first 20 chars):', publicAnonKey?.substring(0, 20));

        const response = await fetch(`${API_BASE}/massages/initialize`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Initialize response status:', response.status);
        console.log('Initialize response ok:', response.ok);

        const responseText = await response.text();
        console.log('Initialize response text:', responseText);

        let data;
        try {
          data = JSON.parse(responseText);
          console.log('Initialize response data:', data);
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
          console.error('Raw response:', responseText);
          throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 200)}`);
        }

        if (response.ok) {
          console.log('Database initialized successfully:', data);
          localStorage.setItem('db_initialized', 'true');
          setInitialized(true);
          
          if (data.message) {
            toast.success(data.message);
          } else {
            toast.success('Database initialized successfully!');
          }
        } else {
          console.error('Failed to initialize database. Status:', response.status, 'Error:', data);
          
          // Show detailed error to user
          const errorMsg = data.error || data.message || 'Unknown error';
          const errorDetails = data.details ? JSON.stringify(data.details) : '';
          const errorHint = data.hint || '';
          
          console.error('Error message:', errorMsg);
          console.error('Error details:', errorDetails);
          console.error('Error hint:', errorHint);
          
          // Retry up to 3 times
          if (retryCount < 3) {
            console.log(`Retrying initialization (attempt ${retryCount + 1}/3)...`);
            setTimeout(() => setRetryCount(retryCount + 1), 2000);
          } else {
            toast.error(`Database init failed: ${errorMsg}`);
          }
        }
      } catch (error) {
        console.error('Failed to initialize database - Exception:', error);
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Retry up to 3 times
        if (retryCount < 3) {
          console.log(`Retrying initialization (attempt ${retryCount + 1}/3)...`);
          setTimeout(() => setRetryCount(retryCount + 1), 2000);
        } else {
          toast.error(`Failed to connect: ${error.message}`);
        }
      }
    };

    init();
  }, [retryCount]);

  return null;
}