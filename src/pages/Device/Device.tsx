
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeviceType } from "@/context/CucoContext";
import { useCuco } from "@/hooks/useCuco";
import { useIpfs } from "@/hooks/useIpfs";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom"
import { useParams } from 'react-router-dom';
import { useWalletProviders } from "@/hooks/useWalletProviders";
import { Edit } from "lucide-react";
import { DeviceInfoTab } from "./DeviceInfoTab";
import { DeviceMetadataTab } from "./DeviceMetadataTab";



const Device = () => {
  const {deviceSN} = useParams();
  const {fetchedDevices, setDeviceState, toggleDeviceVisible, setDeviceMetadataURI, fetchedCustomers} = useCuco();
  const {data, loading: ipfsLoading, error: ipfsError, loadData, uploadToIpfs, clearData} = useIpfs();
  const {buildUrl} = useIpfs();
  const handleCopyValue = useCopyToClipboard();
  const {selectedWallet} = useWalletProviders();
  const [device, setDevice] = useState<DeviceType | undefined>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'main' | 'metadata'>('main');
  const [isEditing, setIsEditing] = useState(false);
  // Store form changes in ref (no re-renders during editing)
  const formChangesRef = useRef<Record<string, string>>({});

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
      // legacy: const tasks: Promise<any>[] = [];
      const changes = formChangesRef.current; // Read all changes from ref
      console.log("Changes:", changes);

      // 1) deviceState (string in changes → number on chain)
      if (changes.deviceState !== undefined) {
        const newState = Number(changes.deviceState);
        if (newState != device.deviceState) {
          await setDeviceState(newState, device.address);
        }
      }
      
      // 2) visible (string "true"/"false" → boolean → toggle if different)
      if (changes.visible !== undefined) {
        const newVisible = changes.visible === "true";
        if (newVisible !== device.visible) {
          await toggleDeviceVisible(device.address);
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
          try {
            await setDeviceMetadataURI(device.address, metadataURI);
            clearData();
            loadData(metadataURI!);
          } catch (error) {
            console.error("Error setting device metadata URI:", error);
          }

        }
      }

      // 4) Run all supported actions
      // Legacy way was relax failure. Now is, first to fail quits update action
      // const results = await Promise.allSettled(tasks);
      // const failed = results.filter(r => r.status === "rejected");
      // if (failed.length) {
      //   console.error("Some actions failed:", failed);
      // }


    } catch (err) {
      console.error("Save error:", err);
    } finally {
      // 5) Clear form changes regardless of outcome
      formChangesRef.current = {};
      setIsEditing(false);
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
                <Edit className="mr-2 h-4 w-4" /> Edit Details
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
              className="rounded-none border-b-2 border-transparent cursor-pointer"
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
              className="rounded-none border-b-2 border-transparent cursor-pointer"
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
            <DeviceInfoTab
              device={device}
              isEditing={isEditing}
              onFieldChange={handleFieldChange}
              customerName={customerName}
              metadataURI={device.metadataURI}
              buildUrl={buildUrl}
              onCopyValue={handleCopyValue}
            />
          )}

          {activeTab === 'metadata' && (
            <DeviceMetadataTab
              metadataURI={device.metadataURI}
              ipfsLoading={ipfsLoading}
              ipfsError={ipfsError}
              data={data}
              isEditing={isEditing}
              onFieldChange={handleFieldChange}
            />
          )}
        </CardContent>
      </Card>
      <Link to="/">{`<<< Home`}</Link>
    </div>
  )
}

export default Device
