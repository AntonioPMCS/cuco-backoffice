import BlockchainContext from "@/context/BlockchainContext";
import { useContext

 } from "react";
export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  return context;
};