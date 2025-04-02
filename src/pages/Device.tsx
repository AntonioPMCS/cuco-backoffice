import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeviceType } from "@/context/BlockchainContext";
import { useBlockchain } from "@/hooks/useBlockchain";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { useParams } from 'react-router-dom';


const Device = () => {
  const {deviceSN} = useParams();
  const {fetchedDevices} = useBlockchain();
  const [device, setDevice] = useState<DeviceType | undefined>();
  const [loading, setLoading] = useState(true)
  // Add state for inline editing
  // const [editingField, setEditingField] = useState<string | null>(null);
  // const [tempValue, setTempValue] = useState("");

  // // Handle edit button click
  // const handleEdit = (field: string, value: string) => {
  //   setEditingField(field)
  //   setTempValue(value)
  // }

  // // Handle save button click
  // const handleSave = async () => {
  //   if (!device || !editingField) return

  //   // Create updated device object
  //   const updatedDevice = {
  //     ...device,
  //     [editingField]: tempValue,
  //   }

  //   // Update device in blockchain context
  //   // Note: You'll need to implement updateDevice in your blockchain context
  //   switch (editingField) {
  //     case state:
        
  //       break;
    
  //     default:
  //       break;
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
  // }

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
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                <p className="text-base">{device.sn}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer</h3>
                <p className="text-base">{device.customer || "N/A"}</p>
              </div>
              <div className="md:col-span-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                <p className="text-base">{device.address}</p>
              </div>
              <div className="md:col-span-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">State</h3>
                <p className="text-base">{device.locked}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Link to="/">Home</Link>
    </div>
  )
}

export default Device
