import { createContext } from "react";


type WalletContextType = { // The context is an array of providers
  providers: EIP6963ProviderDetail[];
  selectedWallet: EIP6963ProviderDetail | null;
  selectedAccount: string | null;
  chainId: string | null;
  //errorMessage: string | null An error message.
  connectWallet: (providerWithInfo: EIP6963ProviderDetail) => Promise<void>
  // disconnectWallet: () => void 
  // clearError: () => void
};


const WalletContext = createContext<WalletContextType>({
    // Default context
    providers: [],
    selectedWallet: null,
    selectedAccount: null,
    chainId: null,
    connectWallet: async (_providerWithInfo: EIP6963ProviderDetail) => {},
});

export default WalletContext;
