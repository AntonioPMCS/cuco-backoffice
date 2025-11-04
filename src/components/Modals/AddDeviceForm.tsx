import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { DeviceType } from "@/context/CucoContext";
import { useCuco } from "@/hooks/useCuco";
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react"
import { useIpfs } from "@/hooks/useIpfs";

interface AddDeviceFormProps {
  addDevice: (customer:string, sn:string, metadata:string ) => void;
  selectedWallet: EIP6963ProviderDetail | null;
}


const AddDeviceForm: React.FC<AddDeviceFormProps> = ({addDevice, selectedWallet}) => {
  const {fetchedCustomers} = useCuco();
  const {loadData, data: ipfsData, error: ipfsError} = useIpfs();
  
  // Default IPFS CID for device metadata
  const DEFAULT_METADATA_URI = "bafkreihvgegayu5iecf52gulitftv7p3rzmoglpynrfezienxtbbfownza";
  
  const [newDevice, setNewDevice] = useState<DeviceType>({
    address: "",
    sn: "",
    customer: "",
    deviceState: 1,
    metadataURI: DEFAULT_METADATA_URI,
    visible: true,
    IT: "",
    BT: "",
    BW: "",
    TW: 0,
    MaxUC: 0,
    ticketlifetime: 0
  });

  // Load IPFS data whenever metadataURI changes
  useEffect(() => {
    if (newDevice.metadataURI && newDevice.metadataURI.trim() !== '') {
      console.log("Loading IPFS data for metadata URI:", newDevice.metadataURI);
      // Clear IPFS-dependent fields before loading new data
      setNewDevice(prev => ({
        ...prev,
        IT: "",
        BT: "",
        BW: "",
        TW: 0,
        MaxUC: 0,
        ticketlifetime: 0
      }));
      loadData(newDevice.metadataURI);
    }
  }, [newDevice.metadataURI, loadData]);

  // Update device with IPFS data when it loads successfully
  useEffect(() => {
    if (ipfsData) {
      console.log("IPFS data loaded successfully:", ipfsData);
      setNewDevice(prev => ({
        ...prev,
        ...ipfsData // Merge IPFS data into device
      }));
    }
  }, [ipfsData]);

  // Clear fields if IPFS fetch fails
  useEffect(() => {
    if (ipfsError) {
      console.error("IPFS fetch failed:", ipfsError);
      // Ensure fields are blank on error (they should already be cleared above, but ensure it)
      setNewDevice(prev => ({
        ...prev,
        IT: "",
        BT: "",
        BW: "",
        TW: 0,
        MaxUC: 0,
        ticketlifetime: 0
      }));
    }
  }, [ipfsError]);

  // Create handler that uses internal state
  const handleSubmit = useCallback(() => {
    addDevice(newDevice.customer, newDevice.sn, newDevice.metadataURI);
  }, [newDevice, addDevice]);


  return (
    <> 
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />Add Device
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[calc(100vh-4rem)] sm:max-w-4xl top-[2rem] translate-y-0 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Add New Device
            </DialogTitle>
            <DialogDescription>
              Fill device SN and customer to add a new device
            </DialogDescription>
          </DialogHeader> 
            <div className="grid gap-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="serialnumber">SerialNumber</Label>
                  <Input 
                    id="serialNumber"
                    value={newDevice.sn}
                    onChange={(e) => setNewDevice({
                      ...newDevice,
                      sn:e.target.value
                    })}
                    placeholder="XPS7G-2K..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deviceState">Device State</Label>
                  <Select
                    value={newDevice.deviceState.toString()}
                    onValueChange={(value) => setNewDevice({
                      ...newDevice,
                      deviceState: parseInt(value)
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select device state"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Free</SelectItem>
                      <SelectItem value="1">Unlocked</SelectItem>
                      <SelectItem value="2">Locked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customerSelect">Customer</Label>
                  <Select
                    value={newDevice.customer}
                    onValueChange={ (value) => setNewDevice({
                      ...newDevice,
                      customer: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer"/>
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
                  <Label htmlFor="customerAddress">Customer Address</Label>
                  <Input
                    id="customerAddress"
                    value={newDevice.customer}
                    readOnly
                    placeholder="0xdB055877e6c13..."
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metadataURI">Metadata URI</Label>
                <Input 
                  id="metadataURI"
                  value={newDevice.metadataURI}
                  onChange={(e) => setNewDevice({
                    ...newDevice,
                    metadataURI: e.target.value
                  })}
                  placeholder={DEFAULT_METADATA_URI}
                />
              </div>
              
              {/* Visual separator */}
              <div className="border-t border-gray-200 my-2"></div>
              
              {/* Informational message */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  The fields below are populated from the metadata file loaded above.
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="installationText">Installation Text</Label>
                <Textarea
                  id="installationText"
                  value={newDevice.IT || ''}
                  readOnly
                  className="bg-muted"
                  placeholder="Enter installation text..."
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="blockText">Block Text</Label>
                <Textarea
                  id="blockText"
                  value={newDevice.BT || ''}
                  readOnly
                  className="bg-muted"
                  placeholder="Enter block text..."
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="blockWarning">Block Warning</Label>
                <Textarea
                  id="blockWarning"
                  value={newDevice.BW || ''}
                  readOnly
                  className="bg-muted"
                  placeholder="Enter block warning..."
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="toleranceWindow">Tolerance Window (Days)</Label>
                <Input
                  id="toleranceWindow"
                  value={newDevice.TW?.toString() || ''}
                  readOnly
                  className="bg-muted"
                  placeholder=""
                />
              </div>
          </div>
          <DialogFooter className="pt-8">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleSubmit} disabled={selectedWallet ? false : true}>Add New Device</Button>
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

export default AddDeviceForm
