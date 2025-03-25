import "../styles/DeviceManager.css"
import useBlockchain, { DeviceType } from '../hooks/useBlockchain'
import { useState } from "react";
import { truncateMiddle } from "../utils";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";
import { Edit, Lock, MoreVertical, Trash2, Unlock } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import DeviceActionsBar from "./DeviceActionsBar";
import ModalTemplate from "./Modals/ModalTemplate";
import DeviceEditForm from "./Modals/DeviceEditForm";

const DeviceManager = () => {
  const { fetchedDevices } = useBlockchain();
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [editDevice, setEditDevice] = useState<DeviceType | null>(null)

  const handleEditDevice = () => {}
  const handleDeleteDevice = (deviceSN:string) => {}

  const toggleSelectAll = () => {}
  const toggleDeviceSelection = (deviceSN:string) => {}

  return (
    <>
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-center gap-4">
        <DeviceActionsBar selectedDevices={selectedDevices}/>
        <div className="border rounded-md">
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
                    <TableCell>{truncateMiddle(device.sn)}</TableCell>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Device</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-serialNumber">Serial Number</Label>
                                  <Input
                                    id="edit-serialNumber"
                                    value={editDevice?.sn || device.sn}
                                    onChange={(e) =>
                                      setEditDevice({
                                        ...(editDevice || device),
                                        sn: e.target.value,
                                      })
                                    }
                                    onClick={() => setEditDevice(device)}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-customerName">Customer Name</Label>
                                  <Input
                                    id="edit-customerName"
                                    value={editDevice?.customer || device.customer}
                                    onChange={(e) =>
                                      setEditDevice({
                                        ...(editDevice || device),
                                        customer: e.target.value,
                                      })
                                    }
                                    onClick={() => setEditDevice(device)}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-state">State</Label>
                                  <Select
                                    value={(editDevice?.locked || device.locked) ? "locked" : "unlocked"}
                                    onValueChange={(value) =>
                                      setEditDevice({
                                        ...(editDevice || device),
                                        locked: value === "locked" ? true : false,
                                      })
                                    }
                                    onOpenChange={() => !editDevice && setEditDevice(device)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="locked">Locked</SelectItem>
                                      <SelectItem value="unlocked">Unlocked</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button onClick={handleEditDevice}>Save Changes</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteDevice(device.sn)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
    </>
  );
}

export default DeviceManager
