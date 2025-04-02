import "../styles/DeviceManager.css"
import { DeviceType } from "@/context/BlockchainContext";
import { useState } from "react";
import { truncateMiddle } from "../utils";
import { Copy, Lock, Unlock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";

import DeviceActionsBar from "./DeviceActionsBar";
import ActionsDropdown from "./DeviceActionsDropdown";
import { useBlockchain } from "@/hooks/useBlockchain";
import { Button } from "./ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { Link } from "react-router-dom";

const DeviceManager = () => {
  const { fetchedDevices, addDevice, fetchedCustomers } = useBlockchain();
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [editDevice, setEditDevice] = useState<DeviceType | null>(null)
  const handleCopyAddress = useCopyToClipboard();

  const handleEditDevice = () => {}
  const handleDeleteDevice = (deviceSN:string) => {console.log(deviceSN)}

  
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
        <DeviceActionsBar selectedDevices={selectedDevices} addDevice={addDevice}/>
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
                <TableHead className="w-[100px]">Actions</TableHead>
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
                  fetchedDevices.map((device) => (
                    <TableRow key={device.sn}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDevices.includes(device.sn)}
                          onCheckedChange={() => toggleDeviceSelection(device.sn)}
                        />
                      </TableCell>
                      
                      <Link to={`/devices/${encodeURIComponent(device.sn)}`} >
                        <TableCell>           
                          {device.sn}
                        </TableCell>
                      </Link>

                      <TableCell>
                        {truncateMiddle(device.address)}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyAddress(device.customer)}
                          title="Copy address"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy address</span>
                        </Button>
                      </TableCell>
                      <Link to={`/customers/${encodeURIComponent(getCustomerName(device.customer))}`} >
                        <TableCell>                        
                          {getCustomerName(device.customer)}
                        </TableCell>
                      </Link>
                      <TableCell>
                        <Badge variant={device.locked < 2 ? "secondary" : "outline"}>
                          {device.locked < 2 ? (
                            <Unlock className="mr-1 h-3 w-3" />
                          ) : (
                            <Lock className="mr-1 h-3 w-3" />
                          )}
                          {device.locked == 0 ? "Free" : device.locked == 1 ? "Unlocked" : "Locked"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ActionsDropdown 
                          editDevice={editDevice} setEditDevice={setEditDevice}
                          device={device}
                          handleEditDevice={handleEditDevice}
                          handleDeleteDevice={handleDeleteDevice}
                        />
                      </TableCell>
                    </TableRow>
                  )
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
