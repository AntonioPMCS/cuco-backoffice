import { useContext } from "react";
import WalletContext from "../context/WalletContext";

export const useWalletProviders = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletProviders must be used within a WalletProvider");
  }
  return context;
};