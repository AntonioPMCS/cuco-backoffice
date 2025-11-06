import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { DEVICE_STATE_OPTIONS } from "@/constants/deviceStates";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { Edit } from "lucide-react";
import { useCuco } from "@/hooks/useCuco";
import { DeviceType } from "@/context/CucoContext";

interface BatchEditDeviceFormProps {
  selectedWallet: EIP6963ProviderDetail | null;
  selectedDevices: DeviceType[];
}


const BatchEditDeviceForm: React.FC<BatchEditDeviceFormProps> = ({selectedWallet, selectedDevices}) => {
  const [batchEditProperty, setBatchEditProperty] = useState<string>("")
  const [batchEditValue, setBatchEditValue] = useState<string>("")
  const description = "Edit one attribute of all the selected devices";
  const { setDeviceState } = useCuco();

  const handleSubmit = async () => {
    console.log("Selected devices: ", selectedDevices);
    console.log("Batch edit property: ", batchEditProperty);
    console.log("Batch edit value: ", batchEditValue);

    for (const device of selectedDevices) {
      
      switch (batchEditProperty) {
        case "state":
          console.log("Editing devices state to:  ", batchEditValue);
          await setDeviceState(Number(batchEditValue), device.address);
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
            <Edit className="mr-2 h-4 w-4" />Batch Edit {selectedDevices.length}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[calc(100vh-4rem)] sm:max-w-4xl top-[2rem] translate-y-0 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Batch Edit Devices
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
                  <SelectItem value="serialNumber">Serial Number</SelectItem>
                  <SelectItem value="customerAddress">Customer Address</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="metadataURI">Metadata URI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {batchEditProperty === "state" ? (
              <div className="grid gap-2">
                  <Label htmlFor="value">New Value</Label>
                  <Select value={batchEditValue} onValueChange={setBatchEditValue}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                        {DEVICE_STATE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="value">New Value</Label>
                <Input id="value" value={batchEditValue} onChange={(e) => setBatchEditValue(e.target.value)} />
              </div>
            )}
          </div>
          <DialogFooter className="pt-8">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleSubmit} disabled={selectedWallet ? false : true}>Batch Edit Devices</Button>
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

export default BatchEditDeviceForm

