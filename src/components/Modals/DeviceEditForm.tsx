import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { DeviceType } from "@/hooks/useBlockchain";

interface DeviceEditFormProps {
  editDevice: DeviceType | null;
  setEditDevice: (device:DeviceType) => void;
  device: DeviceType;
}


const DeviceEditForm: React.FC<DeviceEditFormProps> = 
  ({editDevice, setEditDevice, device}) => {
  
    return (
    <>
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
    </>
    
  )
}

export default DeviceEditForm
