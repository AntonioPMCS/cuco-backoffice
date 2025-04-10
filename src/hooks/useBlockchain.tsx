import BlockchainContext from "@/context/BlockchainContext";
import { useContext } from "react";
import { useGasCostEstimator} from "./useGasCostEstimator";
import { useWalletProviders } from "./useWalletProviders";
import { Contract } from "ethers";
import CuCoBlockchain from "../../abi/CuCoBlockchain.json";

export const useBlockchain = () => {
  const {ethersProvider, selectedAccount} = useWalletProviders();
  const context = useContext(BlockchainContext);  
  if (!context) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }

  const { estimateTransactionCost } = useGasCostEstimator();

  // A helper to return the CUCo contract on current network
  const getCuco = async () => {
    if(!ethersProvider) return "";
    let cucoAddress;
    const network = (await ethersProvider.getNetwork()).name;
    switch (network) {
      case "sepolia":
        cucoAddress = import.meta.env.VITE_CUCOBLOCKCHAIN_SEPOLIA;
        break;
      default:
        cucoAddress = import.meta.env.VITE_CUCOBLOCKCHAIN_LOCALHOST;
        break;
    }
    return new Contract(cucoAddress, CuCoBlockchain.abi, ethersProvider);
  }
  
  // Wrap each blockchain method to include cost estimation
  const wrappedContext = {
    ...context,
    addDevice: async (...args: Parameters<typeof context.addDevice>) => {
      try {
        // Get the original function
        const originalFn = context.addDevice;
        const contract = await getCuco(); // assuming you have this in context
        console.log(contract);
        const estimation = await estimateTransactionCost(
          contract,
          "createDevice",
          args,
          {from: selectedAccount}
        );

        console.log("Estimated cost of addDevice:", estimation);

        
        // Call the original function
        await originalFn(...args);
        
        // Note: This is a simplified implementation. In a real implementation,
        // you would prepare the transaction without sending it, estimate its cost,
        // then send the actual transaction.
        console.log("Transaction would cost approximately: [estimation skipped in this simplified implementation]");
      } catch (error) {
        console.error("Error in wrapped addDevice:", error);
        throw error;
      }
    },
    
    setDeviceState: async (...args: Parameters<typeof context.setDeviceState>) => {
      try {
        console.log("Estimating cost for setDeviceState transaction...");
        await context.setDeviceState(...args);
        console.log("Transaction would cost approximately: [estimation skipped in this simplified implementation]");
      } catch (error) {
        console.error("Error in wrapped setDeviceState:", error);
        throw error;
      }
    },
    
    toggleDeviceVisible: async (...args: Parameters<typeof context.toggleDeviceVisible>) => {
      try {
        console.log("Estimating cost for toggleDeviceVisible transaction...");
        await context.toggleDeviceVisible(...args);
        console.log("Transaction would cost approximately: [estimation skipped in this simplified implementation]");
      } catch (error) {
        console.error("Error in wrapped toggleDeviceVisible:", error);
        throw error;
      }
    },
    
    createCustomer: async (...args: Parameters<typeof context.createCustomer>) => {
      try {
        console.log("Estimating cost for createCustomer transaction...");
        await context.createCustomer(...args);
        console.log("Transaction would cost approximately: [estimation skipped in this simplified implementation]");
      } catch (error) {
        console.error("Error in wrapped createCustomer:", error);
        throw error;
      }
    },
    
    addAdmin: async (...args: Parameters<typeof context.addAdmin>) => {
      try {
        console.log("Estimating cost for addAdmin transaction...");
        await context.addAdmin(...args);
        console.log("Transaction would cost approximately: [estimation skipped in this simplified implementation]");
      } catch (error) {
        console.error("Error in wrapped addAdmin:", error);
        throw error;
      }
    }
  };
  
  return wrappedContext;
};