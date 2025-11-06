import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { Edit } from "lucide-react";
import { CustomerType } from "@/context/CucoContext";

interface BatchEditCustomerFormProps {
  selectedWallet: EIP6963ProviderDetail | null;
  selectedCustomers: CustomerType[];
}


const BatchEditCustomerForm: React.FC<BatchEditCustomerFormProps> = ({selectedWallet, selectedCustomers}) => {
  const [batchEditProperty, setBatchEditProperty] = useState<string>("")
  const [batchEditValue, setBatchEditValue] = useState<string>("")
  const description = "Edit one attribute of all the selected Customers";

  const handleSubmit = async () => {
    console.log("Selected Customers: ", selectedCustomers);
    console.log("Batch edit property: ", batchEditProperty);
    console.log("Batch edit value: ", batchEditValue);

    for (const customer of selectedCustomers) {
      console.log("Editing customer: ", customer);
      switch (batchEditProperty) {
        case "state":
          console.log("Editing Customers state to:  ", batchEditValue);
          break;
        case "metadataURI":
          break;
        case "customerAddress":
          break;
      }
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Edit className="mr-2 h-4 w-4" />Batch Edit {selectedCustomers.length}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[calc(100vh-4rem)] sm:max-w-4xl top-[2rem] translate-y-0 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Batch Edit Customers
            </DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="grid gap-8">
            <div className="grid gap-2">
              <Label htmlFor="property">Attribute</Label>
              <Select value={batchEditProperty} onValueChange={setBatchEditProperty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="customerAddress">Customer Address</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="metadataURI">Metadata URI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="value">New Value</Label>
                <Input id="value" value={batchEditValue} onChange={(e) => setBatchEditValue(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="pt-8">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleSubmit} disabled={selectedWallet ? false : true}>Batch Edit Customers</Button>
            </DialogClose>
          </DialogFooter>
          {!selectedWallet && 
            <span className="mb-8 text-red-500 text-sm text-right block">Connect a wallet to transact with the blockchain</span>
          }
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BatchEditCustomerForm

