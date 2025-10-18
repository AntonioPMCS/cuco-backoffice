import { useState, useEffect, useCallback } from 'react';

interface IpfsState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface UseIpfsReturn extends IpfsState {
  loadData: (hash: string) => Promise<void>;
  clearData: () => void;
}

export const useIpfs = (initialHash?: string): UseIpfsReturn => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (hash: string) => {
    if (!hash) {
      setError('No IPFS hash provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // You can customize the IPFS gateway URL here
      const ipfsUrl = `https://ipfs.io/${hash}`;
      const response = await fetch(ipfsUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch IPFS data: ${response.status} ${response.statusText}`);
      }
      
      const jsonData = await response.json();
      setData(jsonData);
      console.log('IPFS data loaded successfully:', jsonData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error loading IPFS data:', errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // Auto-load data if initialHash is provided
  useEffect(() => {
    if (initialHash) {
      loadData(initialHash);
    }
  }, [initialHash, loadData]);

  return {
    data,
    loading,
    error,
    loadData,
    clearData
  };
};
