import { useEffect, useState } from "react";
import { useWalletProviders } from "@/hooks/useWalletProviders";
import { Contract, ethers, Signer } from "ethers";
import CuCoBlockchain from "../../abi/CuCoBlockchain.json";
import BlockchainContext from "./BlockchainContext";


const BlockchainProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [cucoContract, setCucoContract] = useState<Contract | null>(null);
  const { ethersProvider } = useWalletProviders();

  // Fetch data once on mount or when provider changes.
  useEffect(() => {
    if (!ethersProvider) return;

    async function fetchCucoContract() {
      let cucoAddress;
        const network = (await ethersProvider!.getNetwork()).name;
        switch (network) {
          case "sepolia":
            cucoAddress = import.meta.env.VITE_CUCOBLOCKCHAIN_SEPOLIA;
            break;
          default:
            cucoAddress = import.meta.env.VITE_CUCOBLOCKCHAIN_LOCALHOST;
            break;
        }

        
        // if the user connected the wallet, use the wallet's signer as provider
        let signer:Signer
        try {
          signer = await ethersProvider!.getSigner()
        } catch (error) {
          // if ethersProvider is a FallbackProvider, there's no signer. 
          // Use the fallback but remember it's read-only
          return new Contract(cucoAddress, CuCoBlockchain.abi, ethersProvider);
        }
        // In this case, the user connected his wallet so we use the wallet's signer
        return new Contract(cucoAddress, CuCoBlockchain.abi, signer);
      }

    fetchCucoContract()
    .then((contract) => setCucoContract(contract))
    .catch(console.error);

  }, [ethersProvider]);


  return (
    <BlockchainContext.Provider 
      value={{ 
        cucoContract: cucoContract
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export default BlockchainProvider;