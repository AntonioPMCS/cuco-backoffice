import { Label } from "../ui/label";
import { useState, useCallback } from "react";
import { Input } from "../ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Plus } from "lucide-react";
import { useCuco } from "@/hooks/useCuco";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface AddCustomerFormProps {
  selectedWallet: EIP6963ProviderDetail | null;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({selectedWallet}) => {
  const [customerName, setCustomerName] = useState<string>("")
  const [customerParent, setCustomerParent] = useState<string>("")
  const [deviceMetadata, setDeviceMetadata] = useState<string>("")
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useParentMetadata, setUseParentMetadata] = useState(true);
  const {fetchedCustomers, createCustomer} = useCuco();

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

  const handleCustomerChange = useCallback(async (value: string) => {
    // fetch the deviceMetadata from the fetchedCustomers array
    console.log("Fetching deviceMetadata for customer:", value);
    console.log("Fetched customers:", fetchedCustomers);
    const customer = fetchedCustomers.find((customer) => customer.address === value);
    if (!customer) {
      console.error("Customer not found");
      return;
    }
    console.log(customer.deviceMetadata);
    setCustomerParent(customer.address);
  }, [fetchedCustomers]);

  
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
              Specify name, parent and metadata to add a new customer
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
              <div className="grid grid-cols-2 gap-2">   
                <div className="grid gap-2">
                  <Label htmlFor="parentSelect">Parent</Label>
                  <Select
                    value={customerParent}
                    onValueChange={ handleCustomerChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent"/>
                    </SelectTrigger>
                    <SelectContent>
                      { fetchedCustomers.map((customer) => {
                        return <SelectItem key={customer.address} value={customer.address}>{customer.name}</SelectItem>
                      })
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerAddress">Parent Address</Label>
                  <Input
                    id="parentAddress"
                    value={customerParent}
                    readOnly
                    className="bg-muted"
                  />
                </div>          
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
