import { Label } from "../ui/label";
import { CustomerType } from "@/context/CucoContext";

interface AddCustomerFormProps {
  newCustomer: CustomerType;
  setNewCustomer: (newCustomer:CustomerType) => void;
}


const AddCustomerForm: React.FC<AddCustomerFormProps> = ({newCustomer, setNewCustomer}) => {
  return (
    <>
      <div className="grid gap-2 py-4">
      <Label htmlFor="name">Name</Label>
      <input 
        id="name"
        value={newCustomer.name}
        onChange={(e) => setNewCustomer({
          ...newCustomer,
          name:e.target.value
        })}
      />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="customerAddress">Parent Address</Label>
        <input
          id="parentAddress"
          value={newCustomer.parent}
          onChange={ (e) => setNewCustomer({
            ...newCustomer,
            parent: e.target.value
          })}
        />
      </div>
    </>
    
  )
}

export default AddCustomerForm
