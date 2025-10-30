
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Input } from "./ui/input";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";
import { DeviceType } from "@/context/CucoContext";

interface DeviceActionsDropdownProps {
  editDevice: DeviceType | null;
  setEditDevice: (device:DeviceType) => void;
  device: DeviceType;
  handleEditDevice: (arg0?:any) => void;
  handleHideDevice: (address:string) => void;
}

const DeviceActionsDropdown:React.FC<DeviceActionsDropdownProps> = ({editDevice, setEditDevice, device, handleEditDevice, handleHideDevice}) => {
  
  return (
    <>
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
                    value={(editDevice?.deviceState ?? device.deviceState).toString()}
                    onValueChange={(value) =>
                      setEditDevice({
                        ...(editDevice || device),
                        deviceState: Number(value),
                      })
                    }
                    onOpenChange={() => !editDevice && setEditDevice(device)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Locked</SelectItem>
                      <SelectItem value="1">Unlocked</SelectItem>
                      <SelectItem value="0">Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-serialNumber">Metadata IPFS URI</Label>
                  <Input
                    id="edit-metadata_uri"
                    value={editDevice?.metadataURI || device.metadataURI}
                    onChange={(e) =>
                      setEditDevice({
                        ...(editDevice || device),
                        metadataURI: e.target.value,
                      })
                    }
                    onClick={() => setEditDevice(device)}
                  />
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
            onClick={() => handleHideDevice(device.address)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {device.visible ? "Remove" : "Undo remove"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default DeviceActionsDropdown
