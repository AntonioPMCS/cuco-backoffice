import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";

interface BatchEditFormProps {
  batchEditProperty: string;
  setBatchEditProperty: (property:string) => void;
  batchEditValue: string;
  setBatchEditValue: (value:string) => void;
}


const BatchEditForm: React.FC<BatchEditFormProps> = 
  ({batchEditProperty, setBatchEditProperty, batchEditValue, setBatchEditValue}) => {
  
    return (
    <>
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
    </>
    
  )
}

export default BatchEditForm
