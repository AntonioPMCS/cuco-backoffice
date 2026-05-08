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
  buildUrl: (CID: string) => string;
}

export const useIpfs = (initialHash?: string): UseIpfsReturn => {
  const [data, setData] = useState<any>(null); //TODO: ADD metadata type here
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ipfsGateways = import.meta.env.VITE_IPFS_GATEWAYS.split(',');

  const loadData = useCallback(async (hash: string) => {
    if (!hash) {
      setError('No IPFS hash provided');
      return;
    }

    setLoading(true);
    setError(null);

    let gatewayIndex = 0;
    // remove the ipfs:// prefix
    const cid = hash.replace('ipfs://', '');
    
    while (gatewayIndex < ipfsGateways.length) {
      const ipfsUrl = `https://${ipfsGateways[gatewayIndex]}/ipfs/${cid}#x-ipfs-companion-no-redirect`;

      try {
        console.log(`Fetching IPFS data from ${ipfsUrl}`);
    
        const response = await fetch(ipfsUrl);
    
        if (!response.ok) {
          throw new Error(`IPFS gateway ${ipfsGateways[gatewayIndex]} returned an error: ${response.status} ${response.statusText}`);
        }
    
        const text = await response.text();
        if (!text) {
          throw new Error("Empty response");
        }
    
        const jsonData = JSON.parse(text);
        if (!jsonData) {
          throw new Error("Null JSON");
        }
    
        setData(jsonData);
        setLoading(false);
        return; // SUCCESS → exit function
      } catch (err) {
        console.log(`Gateway failed (${ipfsGateways[gatewayIndex]}):`, err);
        gatewayIndex++; // try next
      }
    }
    setLoading(false);
    throw new Error('All IPFS gateways failed');
  }, []);

  const uploadToIpfs = useCallback(async (jsonObject: any): Promise<string | null> => {
    console.log("Uploading to IPFS:", jsonObject);

    try {
      const res = await fetch("/api/upload-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonObject),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `HTTP ${res.status}: ${res.statusText}` }));
        throw new Error(errorData.error || `Failed to upload: ${res.status} ${res.statusText}`);
      }
  
      const response = await res.json();
      console.log("IPFS Hash:", response.IpfsHash);
      return response.IpfsHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error uploading to IPFS:', errorMessage);
      throw err;
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  // Composes a full IPFS URL from a CID
  const buildUrl = useCallback((CID: string) => {
    return `https://ipfs.io/ipfs/${CID.replace('ipfs://', '')}`;
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
    clearData,
    buildUrl
  };
};
