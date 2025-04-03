import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DeviceType } from "@/context/BlockchainContext";
import { useBlockchain } from "@/hooks/useBlockchain";
import { Check, Edit, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { useParams } from 'react-router-dom';


const Device = () => {
  const {deviceSN} = useParams();
  const {fetchedDevices, setDeviceState, fetchedCustomers} = useBlockchain();
  const [device, setDevice] = useState<DeviceType | undefined>();
  const [loading, setLoading] = useState(true)
  // Add state for inline editing
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

    
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

  // Handle edit button click
  const handleEdit = (field: string, value: string) => {
     setEditingField(field)
     setTempValue(value)
  }

  // Handle cancel button click
  const handleCancel = () => {
    setEditingField(null)
  }

  // Handle save button click
  const handleSave = async () => {
    if (!device || !editingField) return

    switch (editingField) {
      case "state": 
        setDeviceState(Number(tempValue), device.address);
        setEditingField(null);
        break;
    
      default:
        break;
    }
  //   // Create updated device object
  //   const updatedDevice = {
  //     ...device,
  //     [editingField]: tempValue,
  //   }

  //   // Update device in blockchain context
  //   // Note: You'll need to implement updateDevice in your blockchain context
  //   switch (editingField) {

  //   }
  //   if (typeof updateDevice === "function") {
  //     try {
  //       await updateDevice(updatedDevice)
  //       // Update local state
  //       setDevice(updatedDevice)
  //     } catch (error) {
  //       console.error("Failed to update device:", error)
  //     }
  //   } else {
  //     // If updateDevice is not available, just update local state
  //     setDevice(updatedDevice)
  //   }

  //   // Reset editing state
  //   setEditingField(null)
  }

  useEffect(() => {
    if (!fetchedDevices) return;
    setLoading(false);
    setDevice(fetchedDevices.find((_device) => _device.sn == deviceSN ));
  }, [fetchedDevices, deviceSN]);


  // Render a field with inline edit functionality
  const renderEditableField = (label: string, field: string, value: string) => {
    const isEditing = editingField === field

    return (
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{label}</h3>
        <div className="flex items-center gap-2 group">
          {isEditing ? (
            <>
              <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="flex-1" autoFocus />
              <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <p className="text-base flex-1">{value}</p>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleEdit(field, value)}
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

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
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderEditableField("Serial Number", "sn", device.sn)}
              {renderEditableField("State", "state", device.deviceState.toString())}
              {renderEditableField("Belongs to customer", "customer", getCustomerName(device.customer) || "N/A")}
              <div className="md:col-span-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Device Contract (immutable)</h3>
                <p className="text-base">{device.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Link to="/">{`<<< Home`}</Link>
    </div>
  )
}

export default Device
