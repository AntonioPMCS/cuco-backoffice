
import { RenderEditableDropdown, RenderEditableText } from "@/components/FormFields";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeviceType } from "@/context/BlockchainContext";
import { useBlockchain } from "@/hooks/useBlockchain";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { useParams } from 'react-router-dom';


const Device = () => {
  const {deviceSN} = useParams();
  const {fetchedDevices, setDeviceState, fetchedCustomers} = useBlockchain();
  const [device, setDevice] = useState<DeviceType | undefined>();
  const [loading, setLoading] = useState(true)

  const stateOptions = [ 
                    { label: "Free", value:"0"},
                    { label: "Unlocked", value: "1"},
                    { label: "Locked", value: "2"}
                  ]
 
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

  // Handle save button click
  const handleSave = async (field:string, newValue:string) => {
    if (!device) return
    setLoading(true);

    try {
      switch (field) {
        case "deviceState": 
          await setDeviceState(Number(newValue), device.address);
          break;
        default:
          break;
      } 
      // Update the device state locally after successful blockchain update
      setDevice((prevDevice) =>
        prevDevice ? { ...prevDevice, [field]: newValue } : prevDevice
      );
    } catch(error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RenderEditableText 
                label="Serial Number" field="sn" value={device.sn} handleSave={handleSave}
              />
              <RenderEditableDropdown
                label="State" field="deviceState" value={device.deviceState.toString()}
                handleSave={handleSave} options={stateOptions}
              />
              <RenderEditableDropdown
                label="Visible" field="visible" value={device.visible.toString()}
                handleSave={handleSave} options={[
                                                  {label: "True", value: "1"},
                                                  {label: "false", value: "0"}
                                                ]}
              />
              <RenderEditableText
                label="Belongs to customer" field="customer" value={getCustomerName(device.customer)} handleSave={handleSave}
              />
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
