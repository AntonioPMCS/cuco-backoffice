import "../styles/ConnectionBar.css";
import { DiscoverWalletProviders } from '../components/DiscoverWalletProviders';
import { useState, useEffect } from "react";
import Modal from "./Modal_DELETE";
import { truncateMiddle, formatChainAsString } from "../utils";
import { useWalletProviders } from "../hooks/useWalletProviders";
import { ethers } from "ethers";
import useBlockchain from "../hooks/useBlockchain";
import ModalTemplate from "./Modals/ModalTemplate";
import { KeyRound } from "lucide-react";

const ConnectionBar = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const {selectedAccount, chainId, connectWallet, ethersProvider} = useWalletProviders()
  const { getBalance } = useBlockchain();
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

      // Fetch the current address balance
      if (!selectedAccount) return;
      getBalance(selectedAccount)
      .then((balance:bigint | null) => {
        if (!balance) return;
        console.log(selectedAccount + " balance: " + ethers.formatEther(balance))
      })
      .catch((error: any) => {
        console.log(`Error fetching address balance: ${error.message}`);
      });

  }, [ethersProvider]);

  return (
    <div className="connection-bar">
      { !selectedAccount &&
        <>
          <ModalTemplate
            trigger={<><KeyRound className="mr-2 h-4 w-4" />CONNECT</>}
            title="Connect Wallet"
            handler={handleConnect}
          >
            <DiscoverWalletProviders handleClick={handleConnect}/>
          </ModalTemplate>
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
