import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { DeviceType } from "@/context/CucoContext";
import { useCuco } from "@/hooks/useCuco";

interface AddDeviceFormProps {
  newDevice: DeviceType;
  setNewDevice: (newDevice:DeviceType) => void;
}


const AddDeviceForm: React.FC<AddDeviceFormProps> = ({newDevice, setNewDevice}) => {
  const {fetchedCustomers} = useCuco();
  
  return (
    <>
      <div className="grid gap-2">
      <Label htmlFor="serialnumber">SerialNumber</Label>
      <Input 
        id="serialNumber"
        value={newDevice.sn}
        onChange={(e) => setNewDevice({
          ...newDevice,
          sn:e.target.value
        })}
        placeholder="XPS7G-2K..."
      />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="customerSelect">Customer</Label>
          <Select
            value={newDevice.customer}
            onValueChange={ (value) => setNewDevice({
              ...newDevice,
              customer: value
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select customer"/>
            </SelectTrigger>
            <SelectContent>
              { fetchedCustomers.map((customer) => {
                return <SelectItem key={customer.address} value={customer.address}>{customer.name}</SelectItem>
              })
              }
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="customerAddress">Customer Address</Label>
          <Input
            id="customerAddress"
            value={newDevice.customer}
            readOnly
            placeholder="0xdB055877e6c13..."
            className="bg-muted"
          />
        </div>
      </div>
      <div className="grid gap-2 mt-6">
        <Label htmlFor="installationText">Installation Text</Label>
        <Textarea
          id="installationText"
          value={newDevice.installationText || ''}
          onChange={(e) => setNewDevice({
            ...newDevice,
            installationText: e.target.value
          })}
          placeholder="Enter installation text..."
          rows={2}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="blockText">Block Text</Label>
        <Textarea
          id="blockText"
          value={newDevice.blockText || ''}
          onChange={(e) => setNewDevice({
            ...newDevice,
            blockText: e.target.value
          })}
          placeholder="Enter block text..."
          rows={2}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="blockWarning">Block Warning</Label>
        <Textarea
          id="blockWarning"
          value={newDevice.blockWarning || ''}
          onChange={(e) => setNewDevice({
            ...newDevice,
            blockWarning: e.target.value
          })}
          placeholder="Enter block warning..."
          rows={2}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="toleranceWindow">Tolerance Window (Days)</Label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            id="toleranceWindow"
            min="0"
            max="30"
            value={newDevice.toleranceWindow || 0}
            onChange={(e) => setNewDevice({
              ...newDevice,
              toleranceWindow: parseInt(e.target.value)
            })}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 min-w-[2rem]">
            {newDevice.toleranceWindow || 0}
          </span>
        </div>
      </div>
      {/*<div>
        <Label htmlFor="locked">State</Label>
        <Select
          value={(newDevice?.locked ?? newDevice.locked).toString()}
          onValueChange={ (value) => setNewDevice({
            ...newDevice,
            locked: Number(value)
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select state"/>
          </SelectTrigger>
          <SelectContent>
          <SelectItem value="1">Unlocked</SelectItem>
            <SelectItem value="2">Locked</SelectItem>
            <SelectItem value="0">Free</SelectItem>
          </SelectContent>
        </Select>
      </div>*/}
    </>
    
  )
}

export default AddDeviceForm
