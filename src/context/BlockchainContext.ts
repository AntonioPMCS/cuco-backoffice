import { Contract } from "ethers";
import { createContext } from "react";

type BlockchainContextType = {
  cucoContract: Contract | null;
};

const BlockchainContext = createContext<BlockchainContextType>({
    // Default context
    cucoContract: null,
});

export default BlockchainContext;
