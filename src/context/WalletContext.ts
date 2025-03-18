import { createContext } from "react";

type WalletContextType = { // The context is an array of providers
  providers: EIP6963ProviderDetail[];
};


const WalletContext = createContext<WalletContextType>({
    // Default context
    providers: [],
});

export default WalletContext;
