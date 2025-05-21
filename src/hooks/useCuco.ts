import CucoContext from "@/context/CucoContext";
import BlockchainContext from "@/context/BlockchainContext";
import { useContext } from "react";
import { useGasCostEstimator} from "./useGasCostEstimator";
import { useWalletProviders } from "./useWalletProviders";

export const useCuco = () => {
  const {selectedAccount} = useWalletProviders();
  const context = useContext(CucoContext);  
  if (!context) {
    throw new Error("useCuco must be used within a BlockchainProvider");
  }
  const cucoContract = useContext(BlockchainContext).cucoContract;

  const { estimateTransactionCost } = useGasCostEstimator();
  
  // Wrap each blockchain method to include cost estimation
  const wrappedContext = {
    ...context,
    addDevice: async (...args: Parameters<typeof context.addDevice>) => {
      try {
        console.log("! Adding new device !")
        // Get the original function
        const originalFn = context.addDevice;
        const estimation = await estimateTransactionCost(
          cucoContract,
          "createDevice",
          args,
          {from: selectedAccount}
        );

        console.log("Estimated cost of addDevice on Ethereum: $" + estimation.ethereum);
        console.log("Estimated cost of addDevice on Polygon: $" + estimation.polygon);
        
        // Call the original function
        await originalFn(...args);
        
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