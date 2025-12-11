import { useState, useCallback } from 'react';
import { Loading } from '@/components/ui/loading';

export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const startLoading = useCallback((message = 'Loading...') => {
    setIsLoading(true);
    setLoadingMessage(message);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const LoadingComponent = useCallback(() => {
    if (!isLoading) return null;
    return (
      <Loading 
        variant="puff" 
        size={40} 
        fullScreen={true} 
        message={loadingMessage} 
      />
    );
  }, [isLoading, loadingMessage]);

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    setLoadingMessage,
    LoadingComponent,
  };
}
