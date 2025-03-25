import { useCallback, useEffect, useState} from "react";
import WalletContext from "./WalletContext";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers";

declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent
  }
}

const WalletProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [providers, setProviders] = useState<EIP6963ProviderDetail[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail | null>(null)
  const [ethersProvider, setEthersProvider] = useState<ethers.BrowserProvider | null>(null)
  const [chainId, setChainId] = useState<string>("")
  const [selectedAccount, setselectedAccount] = useState<string>("")

  // Effect to listen for provider announcements
  useEffect(() => {
    function onAnnouncement(event: CustomEvent<EIP6963ProviderDetail>) {
      const newProvider = event.detail;
      setProviders((prev) => {
        return prev.some((p) => p.info.uuid === newProvider.info.uuid) ? prev : [...prev, newProvider] 
      })
    }

    window.addEventListener("eip6963:announceProvider", onAnnouncement as EventListener);
    // Request providers to announce themselves dispatching the request event,
    // which triggers the event listener in the MetaMask wallet.
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => {
      window.removeEventListener("eip6963:announceProvider", onAnnouncement as EventListener)
    };
  }, []);

  // Effect to initialize the ethers provider and listen for chain changes
  useEffect(() => {
    if (!selectedWallet) {
      console.log("MetaMask not installed; using read-only default Provider")
      setEthersProvider(ethers.getDefaultProvider("http://localhost:8545") as BrowserProvider);
      return;
    }
    console.log("Initializing Ethers")
    console.log(selectedWallet)
    const provider = selectedWallet.provider;
    // Initialize Ethers provider from selected provider
    const ethersProvider = new ethers.BrowserProvider(provider);
    console.log(ethersProvider)
    setEthersProvider(ethersProvider);

    // Fetch the current chain ID
    provider
      .request({ method: "eth_chainId" })
      .then((chainId) => setChainId(chainId as string))
      .catch(console.error);

    // Listen for chain changes (only if `on` exists)
    const handleChainChanged = (newChainId: string) => {
      setChainId(newChainId);
      //window.location.reload(); //Recommended by MetaMask
    };

    if (provider.on) {
      provider.on("chainChanged", handleChainChanged);
    }

    return () => {
      // What do to when the component unmounts?
    };
  }, [selectedWallet])

  const connectWallet = useCallback(
    async (providerWithInfo: EIP6963ProviderDetail) => {
      try {
        const accounts = (await providerWithInfo.provider.request ({
          method: "eth_requestAccounts",
        })) as string[]
        setSelectedWallet(providerWithInfo)
        setselectedAccount(accounts?.[0])

        const chainId = (await providerWithInfo.provider.request({
          method: "eth_chainId"
        })) as string;
        setChainId(chainId);
      } catch (error) {
        console.error("Failed to connect to provider:", error)
      }
    }, [providers]
  )

  return (
    <WalletContext.Provider value={{ 
      providers,
      selectedWallet,
      ethersProvider,
      selectedAccount,
      chainId,
      connectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;