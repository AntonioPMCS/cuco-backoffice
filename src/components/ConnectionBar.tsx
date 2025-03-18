import "../styles/ConnectionBar.css";
import { DiscoverWalletProviders } from '../components/DiscoverWalletProviders';
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { truncateMiddle, formatChainAsString } from "../utils";
import { useWalletProviders } from "../hooks/useWalletProviders";

const ConnectionBar = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const {selectedAccount, chainId, connectWallet, ethersProvider} = useWalletProviders()

  // Connect to the selected provider using eth_requestAccounts.
  const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
    connectWallet(providerWithInfo);
  }

  useEffect(() => {
    if(!ethersProvider) return;
    // Fetch the current chain ID
    ethersProvider.getNetwork()
      .then((network) => {
        console.log(network.chainId.toString()); // Set the chain ID
      })
      .catch((error) => {
        console.log(`Error fetching chain ID: ${error.message}`);
      });
  }, [ethersProvider]);

  return (
    <div className="connection-bar">
      { !selectedAccount &&
        <>
          <button onClick = {() => setModalOpen(true)} className="connect-btn">🔑 Connect</button>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <DiscoverWalletProviders handleClick={handleConnect}/>
          </Modal>
        </>
      }
      { selectedAccount && chainId &&
        <>
          <p>🟢 {truncateMiddle(selectedAccount)} @ {formatChainAsString(chainId)}</p>
        </>
      }

    </div>
  )
}

export default ConnectionBar
