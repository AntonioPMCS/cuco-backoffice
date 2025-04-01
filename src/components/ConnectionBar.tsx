import "../styles/ConnectionBar.css";
import { DiscoverWalletProviders } from '../components/DiscoverWalletProviders';
import { useEffect } from "react";
import { truncateMiddle, formatChainAsString } from "../utils";
import { useWalletProviders } from "../hooks/useWalletProviders";
import { Dialog, DialogContent, DialogClose, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { KeyRound } from "lucide-react";
import { Button } from "./ui/button";

const ConnectionBar = () => {
  const {selectedAccount, chainId, connectWallet, ethersProvider} = useWalletProviders()
  //const { getBalance } = useBlockchain();
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

  }, [ethersProvider]);

  return (
    <div className="connection-bar">
      { !selectedAccount &&
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <KeyRound className="mr-2 h-4 w-4" />CONNECT
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Connect your wallet
                </DialogTitle>
                <DialogDescription>Choose a provider to connect to the blockchain.</DialogDescription>
              </DialogHeader>  
              <div className="grid gap-4 py-4">
                <DiscoverWalletProviders handleClick={handleConnect}/>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent> 
          </Dialog>
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
