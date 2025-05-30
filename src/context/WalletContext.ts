import { createContext } from "react";
import { BrowserProvider } from "ethers";


type WalletContextType = { // The context is an array of providers
  providers: EIP6963ProviderDetail[];
  selectedWallet: EIP6963ProviderDetail | null;
  ethersProvider: BrowserProvider | null;
  selectedAccount: string | null;
  chainId: string | null;
  //errorMessage: string | null An error message.
  connectWallet: (providerWithInfo: EIP6963ProviderDetail) => Promise<void>;
  // disconnectWallet: () => void 
  // clearError: () => void
};


const WalletContext = createContext<WalletContextType>({
    // Default context
    providers: [],
    selectedWallet: null,
    ethersProvider: null,
    selectedAccount: null,
    chainId: null,
    connectWallet: async (_providerWithInfo: EIP6963ProviderDetail) => {},
});

export default WalletContext;
