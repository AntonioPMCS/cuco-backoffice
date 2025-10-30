
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import { DeviceType } from "@/context/CucoContext";
import { useCuco } from "@/hooks/useCuco";
import { useIpfs } from "@/hooks/useIpfs";
import { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom"
import { useParams } from 'react-router-dom';
import { useWalletProviders } from "@/hooks/useWalletProviders";



const Device = () => {
  const {deviceSN} = useParams();
  const {fetchedDevices, setDeviceState, toggleDeviceVisible, setDeviceMetadataURI, fetchedCustomers} = useCuco();
  const {data, loading: ipfsLoading, error: ipfsError, loadData, uploadToIpfs, clearData} = useIpfs();
  const {selectedWallet} = useWalletProviders();
  const [device, setDevice] = useState<DeviceType | undefined>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'main' | 'metadata'>('main');
  const [isEditing, setIsEditing] = useState(false);
  // Store form changes in ref (no re-renders during editing)
  const formChangesRef = useRef<Record<string, string>>({});

  const stateOptions = [ 
                    { label: "Free", value:"0"},
                    { label: "Unlocked", value: "1"},
                    { label: "Locked", value: "2"}
                  ]

  // Handle field changes - store in ref only (no re-render)
  const handleFieldChange = (field: string, value: string) => {
    formChangesRef.current[field] = value;
  };

  // Find device and load IPFS data, then set complete device
  useEffect(() => {
    if (!fetchedDevices) return;
    
    const foundDevice = fetchedDevices.find((_device) => _device.sn == deviceSN);
    if (!foundDevice) return;

    
    // If device has metadaURI but no IPFS data yet, load it
    if (foundDevice.metadataURI && !data) {
      console.log("Loading IPFS data for device:", foundDevice.sn, "with metadata hash:", foundDevice.metadataURI);
      loadData(foundDevice.metadataURI);
      setDevice(foundDevice);
      setLoading(false);
      return; // Don't set device yet, wait for IPFS data
    }
    
    // Set device with complete data (including IPFS data if available)
    const completeDevice = {
      ...foundDevice,
      ...(data && data)
    };
    
    setDevice(completeDevice);
    setLoading(false);
    
    if (data) {
      console.log("IPFS data loaded successfully for device:", foundDevice.sn);
      console.log("IPFS data content:", data);
    }
  }, [fetchedDevices, deviceSN, data, loadData]);

  // Memoize customer name - only recalculates when device.customer or fetchedCustomers changes
  const customerName = useMemo(() => {
    if (!device?.customer) return "unknown";
    const customer = fetchedCustomers.find((c) => c.address === device.customer);
    return customer ? customer.name : "unknown";
  }, [device?.customer, fetchedCustomers]);

  // Handle save all changes
  const handleSaveAll = async () => {
    console.log("Hello from Save button!");
    console.log("Form changes:", formChangesRef.current);
    console.log("Original device data:", device);
    
    if (!device) return;
    setLoading(true);

    try {
      const tasks: Promise<any>[] = [];
      const changes = formChangesRef.current; // Read all changes from ref
      console.log("Changes:", changes);

      // 1) deviceState (string in changes → number on chain)
      if (changes.deviceState !== undefined) {
        const newState = Number(changes.deviceState);
        if (newState != device.deviceState) {
          tasks.push(setDeviceState(newState, device.address));
        }
      }
      
      // 2) visible (string "true"/"false" → boolean → toggle if different)
      if (changes.visible !== undefined) {
        const newVisible = changes.visible === "true";
        if (newVisible !== device.visible) {
          tasks.push(toggleDeviceVisible(device.address));
        }
      }

      // 3) Unsupported fields for now:
      // - sn, customer
      const metadataChanges: Record<string, string> = {};
      Object.entries(changes).forEach(([key, value]) => {
        if (!["deviceState", "visible", "sn", " customer"].includes(key)) {
          metadataChanges[key] = value;
        }
      });
      if (Object.keys(metadataChanges).length > 0) {
        // Rebuild the metadata object with fields "IT", "BT", "BW","TW", "MaxUC" and "ticketlifetime"
        const metadata = {
          IT: changes.IT?? device.IT,
          BT: changes.BT?? device.BT,
          BW: changes.BW?? device.BW,
          TW: changes.TW?? device.TW,
          MaxUC: changes.MaxUC?? device.MaxUC,
          ticketlifetime: changes.ticketlifetime?? device.ticketlifetime
        };
       
        const metadataURI = await uploadToIpfs(metadata);
        if (metadataURI) {
          tasks.push(setDeviceMetadataURI(device.address, metadataURI));
        }
        clearData();
        loadData(metadataURI!);
      }

      // 4) Run all supported actions
      const results = await Promise.allSettled(tasks);
      const failed = results.filter(r => r.status === "rejected");
      if (failed.length) {
        console.error("Some actions failed:", failed);
      }

      // 5) Clear form changes after successful save
      formChangesRef.current = {};
      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!device) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">Device Not Found</h2>
        <p className="text-muted-foreground">The Device you are looking for does not exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="w-[800px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl">{device.sn}</CardTitle>
            <CardDescription>
              {device.customer ? `Customer: ${device.customer}` : "Device's customer not found"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => {
                setIsEditing(true);
                formChangesRef.current = {}; // Initialize empty ref when entering edit mode
              }} variant="outline">
                Edit
              </Button>
            ) : (
              <div className="flex flex-col items-end">
                <div className="flex gap-2">
                  <Button onClick={handleSaveAll} disabled={loading || selectedWallet ? false : true}>
                    {loading ? "Saving..." : "Save"}
                  </Button>
                <Button onClick={() => {
                  setIsEditing(false);
                  formChangesRef.current = {}; // Clear unsaved changes
                }} variant="outline">
                  Cancel
                </Button>
                </div>
                {!selectedWallet && (
                  <p className="text-xs text-red-500 mt-1">
                    Connect a wallet to transact with the blockchain
                  </p>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 border-b">
            <Button
              variant={activeTab === 'main' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('main')}
              className="rounded-none border-b-2 border-transparent"
              style={activeTab === 'main' ? { 
                borderBottomColor: 'black', 
                color: 'black',
                backgroundColor: 'transparent'
              } : {}}
            >
              Device Info
            </Button>
            <Button
              variant={activeTab === 'metadata' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('metadata')}
              className="rounded-none border-b-2 border-transparent"
              style={activeTab === 'metadata' ? { 
                borderBottomColor: 'black', 
                color: 'black',
                backgroundColor: 'transparent'
              } : {}}
            >
              CUCo Params
            </Button>
          </div>

          {/* Tab Content */}
          {activeTab === 'main' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                  label="Serial Number" 
                  field="sn" 
                  value={device.sn}
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                />
                <FormField
                  label="State" 
                  field="deviceState" 
                  value={device.deviceState?.toString() ?? "0"}
                  type="select"
                  options={stateOptions}
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                />
                <FormField
                  label="Visible" 
                  field="visible" 
                  value={device.visible?.toString() ?? "false"}
                  type="select"
                  options={[
                    {label: "True", value: "true"},
                    {label: "False", value: "false"}
                  ]}
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                />
                <FormField
                  label="Belongs to customer" 
                  field="customer" 
                  value={customerName}
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                />
                <div className="md:col-span-1">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Device Contract (immutable)</h3>
                  <p className="text-base">{device.address}</p>
                </div>
              </div>
              
              {/* Metadata URL in Main tab for quick access */}
              {device.metadataURI && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Metadata URI</h3>
                  <p className="text-base">{device.metadataURI}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="space-y-4">
              {device.metadataURI ? (
                <>
                  {ipfsLoading && (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-sm text-muted-foreground">Loading metadata...</span>
                    </div>
                  )}

                  {ipfsError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="text-red-800 font-medium mb-2">Error loading metadata</h4>
                      <p className="text-red-600 text-sm">{ipfsError}</p>
                    </div>
                  )}

                  {data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(data).map(([key, value]) => (
                        <FormField
                          key={key}
                          label={key}
                          field={key}
                          value={typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          isEditing={isEditing}
                          onFieldChange={handleFieldChange}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No metadata available for this device.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <Link to="/">{`<<< Home`}</Link>
    </div>
  )
}

export default Device
