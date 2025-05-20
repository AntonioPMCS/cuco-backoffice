import "../styles/ConnectionBar.css";
import { DiscoverWalletProviders } from '../components/DiscoverWalletProviders';
import { useEffect } from "react";
import { truncateMiddle, formatChainAsString } from "../utils";
import { useWalletProviders } from "../hooks/useWalletProviders";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogTrigger, DialogDescription} from "./ui/dialog";
import { KeyRound} from "lucide-react";
import { Button } from "./ui/button";

const ConnectionBar = () => {
  const {selectedAccount, chainId, connectWallet, ethersProvider} = useWalletProviders()
  //const { getBalance } = useCuco();
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
        <Dialog>  
          <DialogTrigger asChild>
            <Button><KeyRound className="mr-2 h-4 w-4" />CONNECT</Button>
          </DialogTrigger>
          <DialogContent className="p-0 border border-gray-200 bg-white text-gray-800 max-w-md shadow-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <DialogTitle className="text-lg font-medium text-gray-900">
                  Connect a Wallet
              </DialogTitle>
              <DialogDescription>Choose from your browser wallets</DialogDescription>
              <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none">
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <DiscoverWalletProviders handleClick={handleConnect}/>
              </div>
            </div>
          </DialogContent> 
        </Dialog>
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
