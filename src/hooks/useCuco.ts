import { useContext, useEffect } from "react";
import { useGasCostEstimator} from "./useGasCostEstimator";
import { useWalletProviders } from "./useWalletProviders";

import CucoContext from "@/context/CucoContext";

export const useCuco = () => {
  const {selectedAccount} = useWalletProviders();
  const context = useContext(CucoContext);

  // Log when cucoContract actually changes
  useEffect(() => {
    console.log("CucoContract updated: ", context.cucoContract);
  }, [context.cucoContract]);

  const { estimateTransactionCost } = useGasCostEstimator();
  
  // Wrap each blockchain method to include cost estimation
  const wrappedContext = {
    ...context,
    addDevice: async (...args: Parameters<typeof context.addDevice>) => {
      try {
        console.log("! Adding new device !")
        // Get the original function
        const originalFn = context.addDevice;
        try {
          const estimation = await estimateTransactionCost(
            context.cucoContract,
            "createDevice",
            args,
            {from: selectedAccount}
          );
          console.log("Estimated cost of addDevice on Ethereum: $" + estimation.ethereum);
          console.log("Estimated cost of addDevice on Polygon: $" + estimation.polygon);
        } catch (error) {
          console.error("Error estimating cost for addDevice:", error);
        }
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

    setDeviceMetadataURI: async (...args: Parameters<typeof context.setDeviceMetadataURI>) => {
      try {
        console.log("Estimating cost for toggleDeviceVisible transaction...");
        await context.setDeviceMetadataURI(...args);
        console.log("Transaction would cost approximately: [estimation skipped in this simplified implementation]");
      } catch (error) {
        console.error("Error in wrapped setDeviceMetadataURI:", error);
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
        context.addAdmin(...args);
        console.log("Transaction would cost approximately: [estimation skipped in this simplified implementation]");
      } catch (error) {
        console.error("Error in wrapped addAdmin:", error);
        throw error;
      }
    }
  };
  
  return wrappedContext;
};