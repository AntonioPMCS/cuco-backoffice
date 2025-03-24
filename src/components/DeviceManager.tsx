import "../styles/DeviceManager.css"
import useBlockchain, { DeviceType } from '../hooks/useBlockchain'
import { useState } from "react";
import { truncateMiddle } from "../utils";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";
import { Edit, Lock, MoreVertical, Plus, Trash2, Unlock, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import ModalTemplate from "./Modals/modalTemplate";
import AddDeviceForm from "./Modals/AddDeviceForm";

const DeviceManager = () => {
  const { fetchedDevices } = useBlockchain();
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [newDevice, setNewDevice] = useState<DeviceType>({
    sn: "",
    customer: "",
    locked: false,
  })

  const [editDevice, setEditDevice] = useState<DeviceType | null>(null)
  const [batchDevices, setBatchDevices] = useState<string>("")
  const [batchEditProperty, setBatchEditProperty] = useState<string>("")
  const [batchEditValue, setBatchEditValue] = useState<string>("")

  const handleAddDevice = () => {}
  const handleBatchImport = () => {}
  const handleBatchEdit = () => {}
  const handleEditDevice = () => {}
  const handleDeleteDevice = (deviceSN:string) => {}

  const toggleSelectAll = () => {}
  const toggleDeviceSelection = (deviceSN:string) => {}

  return (
    <>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          
          <ModalTemplate 
            trigger={<><Plus className="mr-2 h-4 w-4" />Add Device</>}
            title="Add New Device"
            handler={handleAddDevice}
          >
            <AddDeviceForm newDevice = {newDevice} setNewDevice = {setNewDevice} />
          </ModalTemplate>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                BatchImport
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Batch Import Devices</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Enter one device per line in the format: Serial Number, Customer Address, State
                </p>
                <Textarea
                  placeholder="SN001, 0x5fc43...342B6, unlocked
                  SN002, 0x2ad11...342F6, locked"
                  value={batchDevices}
                  onChange = {(e) => setBatchDevices(e.target.value)}
                  rows={6}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleBatchImport}>Import</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {selectedDevices.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Batch Edit ({selectedDevices.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Batch Edit Devices</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="property">Property To Edit</Label>
                    <Select value={batchEditProperty} onValueChange={setBatchEditProperty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serialNumber">Serial Number</SelectItem>
                        <SelectItem value="customerAddress">Customer Address</SelectItem>
                        <SelectItem value="state">State</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {batchEditProperty === "state" ? (
                    <div className="grid gap-2">
                       <Label htmlFor="value">New Value</Label>
                       <Select value={batchEditValue} onValueChange={setBatchEditValue}>
                          <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="locked">Locked</SelectItem>
                              <SelectItem value="unlocked">Unlocked</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <Label htmlFor="value">New Value</Label>
                      <Input id="value" value={batchEditValue} onChange={(e) => setBatchEditValue(e.target.value)} />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleBatchEdit}>Update Devices</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

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
                <TableHead>Customer Name</TableHead>
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
                    <TableCell>{device.customer}</TableCell>
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
    <div className="table-container">
      <table className="devices-table">
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Customer</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {fetchedDevices.map((device) => (
            <tr key={device.sn}>
              <td>{truncateMiddle(device.sn)}</td>
              <td>{device.customer}</td>
              <td>{device.locked ? "Locked" : "Unlocked"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}

export default DeviceManager
