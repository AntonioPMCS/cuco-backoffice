import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
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
      <div>
        <Label htmlFor="customerAddress" className="mb-2">Customer</Label>
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
        <input
          id="customerAddress"
          value={newDevice.customer}
          onChange={ (e) => setNewDevice({
            ...newDevice,
            customer: e.target.value
          })}
        />
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
