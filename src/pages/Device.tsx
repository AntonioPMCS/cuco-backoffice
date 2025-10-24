
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import { DeviceType } from "@/context/CucoContext";
import { useCuco } from "@/hooks/useCuco";
import { useIpfs } from "@/hooks/useIpfs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { useParams } from 'react-router-dom';


const Device = () => {
  const {deviceSN} = useParams();
  const {fetchedDevices, setDeviceState, fetchedCustomers} = useCuco();
  const {data, loading: ipfsLoading, error: ipfsError, loadData} = useIpfs();
  const [device, setDevice] = useState<DeviceType | undefined>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'main' | 'metadata'>('main');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<DeviceType>>({});

  const stateOptions = [ 
                    { label: "Free", value:"0"},
                    { label: "Unlocked", value: "1"},
                    { label: "Locked", value: "2"}
                  ]

  // Initialize form data when device loads
  useEffect(() => {
    if (device) {
      setFormData(device);
    }
  }, [device]);

  // Handle field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    if (device?.metadata) {
      console.log("Loading IPFS data for device:", device.sn, "with metadata hash:", device.metadata);
      loadData(device.metadata);
    }
  }, [device?.metadata, device?.sn, loadData]);

  // Log IPFS data when it's loaded
  useEffect(() => {
    if (data) {
      console.log("IPFS data loaded successfully for device:", device?.sn);
      console.log("IPFS data content:", data);
    }
  }, [data, device?.sn]);

 
  const getCustomerName = (address:string) => {
    console.log("Getting name for customer: "+address)
    console.log(fetchedCustomers);
    const customer = fetchedCustomers.find((customer) => {
      console.log("Customer address: "+ customer.address); 
      return customer.address === address
    });
    console.log(customer)
    return customer ? customer.name : "unknown";
  };

  // Handle save all changes
  const handleSaveAll = async () => {
    console.log("Hello from Save button!");
    console.log("Form data:", formData);
    console.log("Original device data:", device);
    
    if (!device) return;
    setLoading(true);

    try {
      // TODO: Implement actual save logic here
      // For now, just log the changes
      console.log("Changes to be saved:");
      Object.entries(formData).forEach(([key, value]) => {
        if (device[key as keyof DeviceType] !== value) {
          console.log(`${key}: ${device[key as keyof DeviceType]} → ${value}`);
        }
      });
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
    } catch(error) {
      console.log("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Legacy handleSave function (kept for compatibility)
  const handleSave = async (field:string, _newValue:string) => {
    console.log("Legacy handleSave called - this should not be used in edit mode");
  }

  useEffect(() => {
    if (!fetchedDevices) return;
    setLoading(false);
    setDevice(fetchedDevices.find((_device) => _device.sn == deviceSN ));
  }, [fetchedDevices, deviceSN]);


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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl">{device.sn}</CardTitle>
            <CardDescription>
              {device.customer ? `Customer: ${device.customer}` : "Device's customer not found"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit
              </Button>
            ) : (
              <>
                <Button onClick={handleSaveAll} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel
                </Button>
              </>
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
                  value={formData.sn || device.sn}
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                />
                <FormField
                  label="State" 
                  field="deviceState" 
                  value={formData.deviceState?.toString() ?? device.deviceState?.toString() ?? "0"}
                  type="select"
                  options={stateOptions}
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                />
                <FormField
                  label="Visible" 
                  field="visible" 
                  value={formData.visible?.toString() ?? device.visible?.toString() ?? "0"}
                  type="select"
                  options={[
                    {label: "True", value: "1"},
                    {label: "False", value: "0"}
                  ]}
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                />
                <FormField
                  label="Belongs to customer" 
                  field="customer" 
                  value={getCustomerName(device.customer)}
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                />
                <div className="md:col-span-1">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Device Contract (immutable)</h3>
                  <p className="text-base">{device.address}</p>
                </div>
              </div>
              
              {/* Metadata URL in Main tab for quick access */}
              {device.metadata && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Metadata URI</h3>
                  <p className="text-base">{device.metadata}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="space-y-4">
              {device.metadata ? (
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
                          field={`metadata.${key}`}
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
