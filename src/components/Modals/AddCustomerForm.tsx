import { Label } from "../ui/label";
import { useState, useCallback } from "react";
import { Input } from "../ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface AddCustomerFormProps {
  selectedWallet: EIP6963ProviderDetail | null;
  createCustomer: (_parentAddress:string, _name:string) => void;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({selectedWallet, createCustomer}) => {
  const [customerName, setCustomerName] = useState<string>("")
  const [customerParent, setCustomerParent] = useState<string>("")
  const [open, setOpen] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!customerName.trim() || !customerParent.trim()) {
      console.log("Customer name or parent address is empty");
      return;
    }
    console.log("Submitting with:", { customerName, customerParent });
    try {
      await createCustomer(customerParent, customerName);
      // Reset form and close dialog after successful submission
      setCustomerName("");
      setCustomerParent("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create customer:", error);
      // Don't close dialog on error so user can retry
    }
  }, [customerName, customerParent, createCustomer]);
  
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
          <div className="grid gap-2 py-4">
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
          <DialogFooter className="pt-8">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={selectedWallet ? false : true}>Add New Customer</Button>
          </DialogFooter> 
          {!selectedWallet && 
            <span className="mb-8 text-red-500 text-sm text-right block">Connect a wallet to transact with the blockchain</span>
          }       
        </DialogContent> 
      </Dialog>
    </>
    
  )
}

export default AddCustomerForm
