import "../styles/DeviceManager.css"
import { DeviceType } from "@/context/CucoContext";
import { useState } from "react";
import { truncateMiddle } from "../utils";
import { Copy, Lock, Unlock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";

import DeviceActionsBar from "./DeviceActionsBar";
import ActionsDropdown from "./DeviceActionsDropdown";
import { useCuco } from "@/hooks/useCuco";
import { Button } from "./ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { Link } from "react-router-dom";
import { useWalletProviders } from "@/hooks/useWalletProviders";

const DeviceManager = () => {
  const { fetchedDevices, addDevice, fetchedCustomers, toggleDeviceVisible } = useCuco();
  const {selectedWallet} = useWalletProviders();
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [editDevice, setEditDevice] = useState<DeviceType | null>(null)
  const [showHidden, setShowHidden] = useState(false)
  const handleCopyAddress = useCopyToClipboard();

  const handleEditDevice = () => {}
  const handleHideDevice = async (deviceAddress:string) => {
    console.log(deviceAddress)
    try {
      await toggleDeviceVisible(deviceAddress);
      // Update the device state locally after successful blockchain update
    } catch(error) {
      console.log(error);
    } finally {
    }
  }

  
  const getCustomerName = (address:string) => {
    const customer = fetchedCustomers.find((customer) => {
      return customer.address === address
    });
    return customer ? customer.name : "unknown";
  };

  const toggleSelectAll = () => {
    if (selectedDevices.length === fetchedDevices.length) {
      setSelectedDevices([])
    } else {
      setSelectedDevices(fetchedDevices.map((device) => device.sn))
    }
  }

  const toggleDeviceSelection = (deviceSN:string) => {
    setSelectedDevices((prev) => (prev.includes(deviceSN) ?
        prev.filter((deviceId) => deviceId !== deviceSN) :
        [...prev, deviceSN]
      ))
  }

  return (
    <>
    <div className="space-y-6 w-full">
      <div className="flex flex-col justify-between items-center gap-4">
        <DeviceActionsBar 
          selectedDevices={selectedDevices} 
          addDevice={addDevice}
          showHidden={showHidden}
          setShowHidden={setShowHidden}
        />
        <div className="border rounded-md w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked = {selectedDevices.length === fetchedDevices.length && fetchedDevices.length > 0 }
                    onCheckedChange = {toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Assigned to</TableHead>
                <TableHead>State</TableHead>
                {selectedWallet && 
                  <TableHead className="w-[100px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetchedDevices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No devices found. Add a device to get started.
                  </TableCell>
                </TableRow>
                ) : (
                  fetchedDevices.map((device:DeviceType) => {
                    if (!showHidden && !device.visible) return;
                    return (<TableRow key={device.sn}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDevices.includes(device.sn)}
                          onCheckedChange={() => toggleDeviceSelection(device.sn)}
                        />
                      </TableCell>

                      <TableCell>  
                        <Link to={`/devices/${encodeURIComponent(device.sn)}`} >         
                          {device.sn}
                        </Link>
                      </TableCell>

                      <TableCell>
                        {truncateMiddle(device.address)}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyAddress(device.address)}
                          title="Copy address"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy address</span>
                        </Button>
                      </TableCell>
                      
                      <TableCell>   
                        <Link to={`/customers/${encodeURIComponent(getCustomerName(device.customer))}`} >                     
                          {getCustomerName(device.customer)}
                        </Link>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant={device.deviceState < 2 ? "outline" : "secondary"}>
                          {device.deviceState < 2 ? (
                            <Unlock className="mr-1 h-3 w-3" />
                          ) : (
                            <Lock className="mr-1 h-3 w-3" />
                          )}
                          {device.deviceState == 0 ? "Free" : device.deviceState == 1 ? "Unlocked" : "Locked"}
                        </Badge>
                      </TableCell>
                      {selectedWallet && <TableCell>
                        <ActionsDropdown 
                          editDevice={editDevice} setEditDevice={setEditDevice}
                          device={device}
                          handleEditDevice={handleEditDevice}
                          handleHideDevice={handleHideDevice}
                        />
                      </TableCell>}
                    </TableRow>
                  )}
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeviceManager
