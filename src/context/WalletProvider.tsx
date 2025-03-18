import { useCallback, useEffect, useState} from "react";
import WalletContext from "./WalletContext";

declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent
  }
}

const WalletProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [providers, setProviders] = useState<EIP6963ProviderDetail[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail | null>(null)
  const [chainId, setChainId] = useState<string>("")
  const [selectedAccount, setselectedAccount] = useState<string>("")

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

  useEffect(() => {
    if (!selectedWallet) return;

    const provider = selectedWallet.provider;

    // Fetch the current chain ID
    provider
      .request({ method: "eth_chainId" })
      .then((chainId) => setChainId(chainId as string))
      .catch(console.error);

    // Listen for chain changes (only if `on` exists)
    const handleChainChanged = (newChainId: string) => {
      setChainId(newChainId);
      //window.location.reload(); Recommended by MetaMask
    };

    if (provider.on) {
      provider.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (provider.on) {
        provider.on("chainChanged", handleChainChanged);
      }
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
    }, [providers, selectedAccount]
  )

  return (
    <WalletContext.Provider value={{ 
      providers,
      selectedWallet,
      selectedAccount,
      chainId,
      connectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;