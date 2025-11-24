import { useCallback } from "react";

export const useCopyToClipboard = () => {

  const copyToClipboard = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    console.log("Copied successfully!"); // ✅ Debug log
  }, []);

  return copyToClipboard;
};
