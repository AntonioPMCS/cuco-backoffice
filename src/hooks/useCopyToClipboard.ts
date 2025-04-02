import { useCallback } from "react";

export const useCopyToClipboard = () => {

  const copyToClipboard = useCallback((address: string) => {
    navigator.clipboard.writeText(address);
    console.log("Copied successfully!"); // ✅ Debug log
  }, []);

  return copyToClipboard;
};
