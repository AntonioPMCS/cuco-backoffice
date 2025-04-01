import "../styles/DeviceManager.css"
import { DeviceType } from "@/context/BlockchainContext";
import { useState } from "react";
import { truncateMiddle } from "../utils";
import { Lock, Unlock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";

import DeviceActionsBar from "./DeviceActionsBar";
import ActionsDropdown from "./DeviceActionsDropdown";
import { useBlockchain } from "@/hooks/useBlockchain";

const DeviceManager = () => {
  const { fetchedDevices } = useBlockchain();
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [editDevice, setEditDevice] = useState<DeviceType | null>(null)

  const handleEditDevice = () => {}
  const handleDeleteDevice = (deviceSN:string) => {console.log(deviceSN)}

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
        <DeviceActionsBar selectedDevices={selectedDevices}/>
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
                <TableHead>Customer Address</TableHead>
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
                      <TableCell>{device.sn}</TableCell>
                      <TableCell>{truncateMiddle(device.customer)}</TableCell>
                      <TableCell>
                        <Badge variant={device.locked ? "secondary" : "outline"}>
                          {device.locked ? (
                            <Lock className="mr-1 h-3 w-3" />
                          ) : (
                            <Unlock className="mr-1 h-3 w-3" />
                          )}
                          {device.locked}
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
