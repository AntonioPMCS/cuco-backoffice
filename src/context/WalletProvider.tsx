import { useEffect, useState} from "react";
import WalletContext from "./WalletContext";

const WalletProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [providers, setProviders] = useState<EIP6963ProviderDetail[]>([]);

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
  return (
    <WalletContext.Provider value={{ providers}}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;