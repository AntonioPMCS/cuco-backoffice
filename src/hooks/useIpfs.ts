import { useState, useEffect, useCallback } from 'react';

interface IpfsState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface UseIpfsReturn extends IpfsState {
  loadData: (hash: string) => Promise<void>;
  uploadToIpfs: (data: any) => Promise<string | null>;
  clearData: () => void;
}

export const useIpfs = (initialHash?: string): UseIpfsReturn => {
  const [data, setData] = useState<any>(null); //TODO: ADD metadata type here
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
      // hash example: ipfs://bafkreihccimod2m7y7txvnm34kocealmr7u2yurqohwgleaslloh2fokzi
      // remove the ipfs:// prefix
      const cid = hash.replace('ipfs://', '');
      // add #x-ipfs-companion-no-redirect to the end of the url 
      const ipfsUrl = `https://ipfs.io/ipfs/${cid}#x-ipfs-companion-no-redirect`;
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

  const uploadToIpfs = useCallback(async (jsonObject: any): Promise<string | null> => {
    console.log("Uploading to IPFS:", jsonObject);

    const res = await fetch("/api/upload-json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonObject),
    });
  
    const response = await res.json();
    console.log("IPFS Hash:", response.IpfsHash);
    return response.IpfsHash;
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
    uploadToIpfs,
    clearData
  };
};
