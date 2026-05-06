import "../styles/ConnectionBar.css";
import { DiscoverWalletProviders } from '../components/DiscoverWalletProviders';
import { useEffect } from "react";
import { formatChainAsString } from "../utils";
import { useWalletProviders } from "../hooks/useWalletProviders";
import { useCuco } from "@/hooks/useCuco";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogTrigger, DialogDescription} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, Copy, KeyRound} from "lucide-react";
import { Button } from "./ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

const ConnectionBar = () => {
  const {selectedAccount, chainId, connectWallet, ethersProvider} = useWalletProviders()
  const { cucoContract } = useCuco()
  const handleCopyValue = useCopyToClipboard()
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="default" size="sm" className="gap-1.5 font-normal">
              <span className="font-medium whitespace-nowrap">🟢 Connected</span>
              <ChevronDown className="size-4 shrink-0" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="w-72 p-3 text-xs"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <div className="space-y-3 select-text">
              <div>
                <div className="text-muted-foreground font-medium mb-1">Blockchain:</div>
                <div className="font-mono text-sm text-foreground">{formatChainAsString(chainId)}</div>
              </div>
              <div>
                <div className="text-muted-foreground font-medium mb-1">Account:</div>
                <div className="flex items-start gap-2">
                  <div className="font-mono text-sm text-foreground break-all min-w-0 flex-1">
                    {selectedAccount}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 cursor-pointer"
                    type="button"
                    onClick={() => handleCopyValue(selectedAccount)}
                    title="Copy address"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy account address</span>
                  </Button>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground font-medium mb-1">CUCo Address:</div>
                {cucoContract ? (
                  <div className="flex items-start gap-2">
                    <div className="font-mono text-sm text-foreground break-all min-w-0 flex-1">
                      {String(cucoContract.target)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 cursor-pointer"
                      type="button"
                      onClick={() =>
                        handleCopyValue(String(cucoContract.target))
                      }
                      title="Copy address"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy CUCo contract address</span>
                    </Button>
                  </div>
                ) : (
                  <div className="font-mono text-sm text-foreground">—</div>
                )}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    </div>
  )
}

export default ConnectionBar
