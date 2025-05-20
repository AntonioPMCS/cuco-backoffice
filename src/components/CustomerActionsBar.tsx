import { useState } from "react";
import { Edit, Plus, Upload } from "lucide-react"
import ModalTemplate from "./Modals/ModalTemplate"
import AddCustomerForm from "./Modals/AddCustomerForm";
import { CustomerType } from "@/context/CucoContext";
import BatchCustomerImportForm from "./Modals/BatchCustomerImportForm";
import BatchEditForm from "./Modals/BatchEditForm";

interface CustomerActionsBarProps {
  selectedCustomers: string[];
  createCustomer: (_parentAddress:string, _name:string) => void;
}

const CustomerActionsBar:React.FC<CustomerActionsBarProps> = ({selectedCustomers, createCustomer}) => {
  const [batchCustomers, setBatchCustomers] = useState<string>("")
  const [batchEditProperty, setBatchEditProperty] = useState<string>("")
  const [batchEditValue, setBatchEditValue] = useState<string>("")
  const [newCustomer, setNewCustomer] = useState<CustomerType>({
    name: "",
    parent: "",
    parentName: "",
    address: "",
    authorizedUsers: []
  })

  const handleAddCustomer = () => {
    console.log(newCustomer);
    createCustomer(newCustomer.parent, newCustomer.name)
  }
  const handleBatchImport = () => {}
  const handleBatchEdit = () => {}
  
  return (
    <div className="flex items-center gap-2">
      <ModalTemplate 
        trigger={<><Plus className="mr-2 h-4 w-4" />Add Customer</>}
        title="Add New Customer"
        handler={handleAddCustomer}
        description="Create a new customer providing a name and a parent address"
      >
        <AddCustomerForm newCustomer = {newCustomer} setNewCustomer = {setNewCustomer} />
      </ModalTemplate>

      <ModalTemplate
        trigger={<><Upload className="mr-2 h-4 w-4" />BatchImport</>}
        title="Batch Import Customers"
        handler={handleBatchImport}
      >
        <BatchCustomerImportForm batchCustomers={batchCustomers} setBatchCustomers={setBatchCustomers} />
      </ModalTemplate>

      {selectedCustomers.length > 0 && (
        <ModalTemplate
          trigger={<><Edit className="mr-2 h-4 w-4" />Batch Edit {selectedCustomers.length}</>}
          title="Batch Edit Customers"
          handler={handleBatchEdit}
        >
          <BatchEditForm 
            batchEditProperty={batchEditProperty} setBatchEditProperty={setBatchEditProperty}
            batchEditValue={batchEditValue} setBatchEditValue={setBatchEditValue} 
          />
        </ModalTemplate>
      )}
    </div>
  )
}

export default CustomerActionsBar
