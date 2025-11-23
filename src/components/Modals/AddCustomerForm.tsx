import { Label } from "../ui/label";
import { useState } from "react";
import { Input } from "../ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Plus } from "lucide-react";

interface AddCustomerFormProps {
  selectedWallet: EIP6963ProviderDetail | null;
  createCustomer: (_parentAddress:string, _name:string, _deviceMetadata:string) => Promise<void>;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({selectedWallet, createCustomer}) => {
  const [customerName, setCustomerName] = useState<string>("")
  const [customerParent, setCustomerParent] = useState<string>("")
  const [deviceMetadata, setDeviceMetadata] = useState<string>("")
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useParentMetadata, setUseParentMetadata] = useState(true);

  const handleSubmit = async () => {
    setLoading(true);
    if (!customerName.trim() || !customerParent.trim()) {
      console.log("Customer name or parent address is empty");
      return;
    }
    console.log("Submitting with:", { customerName, customerParent });

    try {
      await createCustomer(customerParent, customerName, deviceMetadata);
      // Reset form and close dialog after successful submission
      setCustomerName("");
      setCustomerParent("");
    } catch (error) {
      console.error("Failed to create customer:", error);
      // Don't close dialog on error so user can retry
    }
    setLoading(false);
    setOpen(false);
  };

  
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />Add Customer
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[calc(100vh-4rem)] sm:max-w-4xl top-[2rem] translate-y-0 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Add New Customer
            </DialogTitle>
            <DialogDescription>
              Fill customer name and parent address to add a new customer
            </DialogDescription>
          </DialogHeader> 
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
          {!loading && (
            <>
            <div className="grid gap-8">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customerAddress">Parent Address</Label>
                <Input
                  id="parentAddress"
                  value={customerParent}
                  onChange={ (e) => setCustomerParent(e.target.value)}
                />
              </div>
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="useParentMetadata"
                    checked={useParentMetadata}
                    onCheckedChange={setUseParentMetadata}
                  />
                  <Label htmlFor="useParentMetadata" className="cursor-pointer">Use Default Device Metadata</Label>
                </div>
              </div>
              {!useParentMetadata && (
                <div className="grid gap-2">
                  <Label htmlFor="deviceMetadata">Custom Device Metadata</Label>
                  <Input
                    id="deviceMetadata"
                    value={deviceMetadata}
                    onChange={(e) => setDeviceMetadata(e.target.value)}
                    placeholder="IPFS CID or URI..."
                  />
                </div>
              )}
            </div>
              <DialogFooter className="pt-8">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSubmit} disabled={selectedWallet ? false : true}>Add New Customer</Button>
              </DialogFooter>
            </>
          )}
          {!selectedWallet && 
            <span className="mb-8 text-red-500 text-sm text-right block">Connect a wallet to transact with the blockchain</span>
          }       
        </DialogContent> 
      </Dialog>
    </>
    
  )
}

export default AddCustomerForm
