import { Label } from "../ui/label";
import { useState, useCallback, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Plus } from "lucide-react";
import { useCuco } from "@/hooks/useCuco";
import { useIpfs } from "@/hooks/useIpfs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface AddCustomerFormProps {
  selectedWallet: EIP6963ProviderDetail | null;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({selectedWallet}) => {
  const [customerName, setCustomerName] = useState<string>("")
  const [customerParent, setCustomerParent] = useState<string>("")
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useParentMetadata, setUseParentMetadata] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {fetchedCustomers, createCustomer} = useCuco();
  const {loadData, data: ipfsData, error: ipfsError, uploadToIpfs} = useIpfs();
  
  // IPFS fields state
  const [ipfsFields, setIpfsFields] = useState({
    IT: "",
    BT: "",
    BW: "",
    TW: 0,
    MaxUC: 0,
    ticketlifetime: 0
  });

  const handleSubmit = async () => {
    setErrorMessage("");
    setLoading(true);
    if (!customerName.trim() || !customerParent.trim()) {
      // Display error message to the user
      setErrorMessage("Customer name and parent address are required");
      setLoading(false);
      return;
    }
    console.log("Submitting with:", { customerName, customerParent });

    try {
      let finalMetadata: string;
      
      if (useParentMetadata) {
        // Use parent's metadata
        const parentCustomer = fetchedCustomers.find(c => c.address === customerParent);
        finalMetadata = parentCustomer?.deviceMetadata || "";
      } else {
        // Upload IPFS fields to IPFS and use the returned hash
        const ipfsObject = {
          IT: ipfsFields.IT || "",
          BT: ipfsFields.BT || "",
          BW: ipfsFields.BW || "",
          TW: ipfsFields.TW || 0,
          MaxUC: ipfsFields.MaxUC || 0,
          ticketlifetime: ipfsFields.ticketlifetime || 0
        };
        
        console.log("Uploading IPFS data:", ipfsObject);
        const ipfsHash = await uploadToIpfs(ipfsObject);
        if (!ipfsHash) {
          throw new Error("Failed to upload metadata to IPFS");
        }
        finalMetadata = ipfsHash;
        console.log("IPFS hash received:", ipfsHash);
      }
      
      await createCustomer(customerParent, customerName, finalMetadata);
      // Reset form and close dialog after successful submission
      setCustomerName("");
      setCustomerParent("");
      setIpfsFields({
        IT: "",
        BT: "",
        BW: "",
        TW: 0,
        MaxUC: 0,
        ticketlifetime: 0
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to create customer:", error);
      // Don't close dialog on error so user can retry
    }
    setLoading(false);
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

  // Load IPFS data from parent when useParentMetadata is true and parent is selected
  useEffect(() => {
    if (useParentMetadata && customerParent) {
      const customer = fetchedCustomers.find((c) => c.address === customerParent);
      const metadataURI = customer?.deviceMetadata || "";
      if (metadataURI && metadataURI.trim() !== '') {
        console.log("Loading IPFS data for metadata URI:", metadataURI);
        // Clear IPFS-dependent fields before loading new data
        setIpfsFields({
          IT: "",
          BT: "",
          BW: "",
          TW: 0,
          MaxUC: 0,
          ticketlifetime: 0
        });
        loadData(metadataURI);
      } else {
        // Clear fields if no metadata URI
        setIpfsFields({
          IT: "",
          BT: "",
          BW: "",
          TW: 0,
          MaxUC: 0,
          ticketlifetime: 0
        });
      }
    } else if (!useParentMetadata) {
      // When switching to custom metadata, clear fields but don't load from IPFS
      // Fields will be editable
      setIpfsFields({
        IT: "",
        BT: "",
        BW: "",
        TW: 0,
        MaxUC: 0,
        ticketlifetime: 0
      });
    }
  }, [useParentMetadata, customerParent, fetchedCustomers, loadData]);

  // Update IPFS fields when data loads successfully (only when using parent metadata)
  useEffect(() => {
    if (ipfsData && useParentMetadata) {
      console.log("IPFS data loaded successfully:", ipfsData);
      setIpfsFields(prev => ({
        ...prev,
        ...ipfsData // Merge IPFS data into fields
      }));
    }
  }, [ipfsData, useParentMetadata]);

  // Clear fields if IPFS fetch fails
  useEffect(() => {
    if (ipfsError) {
      console.error("IPFS fetch failed:", ipfsError);
      // Ensure fields are blank on error
      setIpfsFields({
        IT: "",
        BT: "",
        BW: "",
        TW: 0,
        MaxUC: 0,
        ticketlifetime: 0
      });
    }
  }, [ipfsError]);

  
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
          </DialogHeader> 
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
          {!loading && (
            <>
            <div className="grid gap-8">
              {/* Customer Information Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Customer Information</h3>
                  <p className="text-xs text-gray-500">Basic details about the customer</p>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">   
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
                </div>
              </div>
              
              {/* Visual separator */}
              <div className="border-t border-gray-200"></div>
              
              {/* Device Metadata Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Device Metadata</h3>
                  <p className="text-xs text-gray-500">Configure device metadata settings</p>
                </div>
                <div className="flex items-center space-x-2 pb-2">
                  <Switch
                    id="useParentMetadata"
                    checked={useParentMetadata}
                    onCheckedChange={setUseParentMetadata}
                  />
                  <Label htmlFor="useParentMetadata" className="cursor-pointer">Use Parent Device Metadata</Label>
                </div>
                <div className="grid gap-6">
                  {/* Informational message */}
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm text-blue-800">
                      {useParentMetadata 
                        ? "The fields below are populated from the parent's metadata file."
                        : "Edit the fields below to create custom device metadata. These will be uploaded to IPFS when you submit."}
                    </p>
                  </div>
              
                  <div className="grid gap-2">
                    <Label htmlFor="installationText">Installation Text</Label>
                    <Textarea
                      id="installationText"
                      value={ipfsFields.IT || ''}
                      readOnly={useParentMetadata}
                      onChange={(e) => !useParentMetadata && setIpfsFields(prev => ({ ...prev, IT: e.target.value }))}
                      className={useParentMetadata ? "bg-muted" : ""}
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="blockText">Block Text</Label>
                    <Textarea
                      id="blockText"
                      value={ipfsFields.BT || ''}
                      readOnly={useParentMetadata}
                      onChange={(e) => !useParentMetadata && setIpfsFields(prev => ({ ...prev, BT: e.target.value }))}
                      className={useParentMetadata ? "bg-muted" : ""}
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="blockWarning">Block Warning</Label>
                    <Textarea
                      id="blockWarning"
                      value={ipfsFields.BW || ''}
                      readOnly={useParentMetadata}
                      onChange={(e) => !useParentMetadata && setIpfsFields(prev => ({ ...prev, BW: e.target.value }))}
                      className={useParentMetadata ? "bg-muted" : ""}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="toleranceWindow">Tolerance Window (days)</Label>
                      <Input
                        id="toleranceWindow"
                        type="number"
                        min="0"
                        step="1"
                        value={ipfsFields.TW?.toString() || ''}
                        readOnly={useParentMetadata}
                        onChange={(e) => !useParentMetadata && setIpfsFields(prev => ({ ...prev, TW: parseInt(e.target.value) || 0 }))}
                        className={useParentMetadata ? "bg-muted" : ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maxUC">MaxUC</Label>
                      <Input
                        id="maxUC"
                        type="number"
                        min="0"
                        step="1"
                        value={ipfsFields.MaxUC?.toString() || ''}
                        readOnly={useParentMetadata}
                        onChange={(e) => !useParentMetadata && setIpfsFields(prev => ({ ...prev, MaxUC: parseInt(e.target.value) || 0 }))}
                        className={useParentMetadata ? "bg-muted" : ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ticketLifetime">Ticket Lifetime (seconds)</Label>
                      <Input
                        id="ticketLifetime"
                        type="number"
                        min="0"
                        step="1"
                        value={ipfsFields.ticketlifetime?.toString() || ''}
                        readOnly={useParentMetadata}
                        onChange={(e) => !useParentMetadata && setIpfsFields(prev => ({ ...prev, ticketlifetime: parseInt(e.target.value) || 0 }))}
                        className={useParentMetadata ? "bg-muted" : ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
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
          {errorMessage && <span className="mb-8 text-red-500 text-sm text-right block">{errorMessage}</span>}       
        </DialogContent> 
      </Dialog>
    </>
    
  )
}

export default AddCustomerForm
