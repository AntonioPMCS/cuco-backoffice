import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DeviceType

 } from "@/hooks/useBlockchain";
interface AddDeviceFormProps {
  newDevice: DeviceType;
  setNewDevice: (newDevice:DeviceType) => void;
}


const AddDeviceForm: React.FC<AddDeviceFormProps> = ({newDevice, setNewDevice}) => {
  return (
    <>
      <div className="grid gap-2 py-4">
      <Label htmlFor="serialnumber">SerialNumber</Label>
      <input 
        id="serialNumber"
        value={newDevice.sn}
        onChange={(e) => setNewDevice({
          ...newDevice,
          sn:e.target.value
        })}
      />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="customerAddress">Customer Address</Label>
        <input
          id="customerAddress"
          value={newDevice.customer}
          onChange={ (e) => setNewDevice({
            ...newDevice,
            customer: e.target.value
          })}
        />
      </div>
      <div>
        <Label htmlFor="locked">State</Label>
        <Select
          value={newDevice.locked? "locked" : "unlocked"}
          onValueChange={ (value) => setNewDevice({
            ...newDevice,
            locked: value == "Locked" ? true: false
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select state"/>
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

export default AddDeviceForm
