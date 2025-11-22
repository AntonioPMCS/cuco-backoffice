import { useState } from "react";
import { Edit, Upload } from "lucide-react"
import ModalTemplate from "./Modals/ModalTemplate"
import AddCustomerForm from "./Modals/AddCustomerForm";
import { CustomerType } from "@/context/CucoContext";
import BatchCustomerImportForm from "./Modals/BatchCustomerImportForm";
import BatchEditCustomerForm from "./Modals/BatchEditCustomerForm";
import { useWalletProviders } from "@/hooks/useWalletProviders";

interface CustomerActionsBarProps {
  selectedCustomers: string[];
  createCustomer: (_parentAddress:string, _name:string, _deviceMetadata:string) => Promise<void>;
}

const CustomerActionsBar:React.FC<CustomerActionsBarProps> = ({selectedCustomers, createCustomer}) => {
  const [batchCustomers, setBatchCustomers] = useState<string>("")
  const {selectedWallet} = useWalletProviders()

  const handleBatchImport = () => {}
  const handleBatchEdit = () => {}
  
  return (
    <div className="flex items-center gap-2">

      <AddCustomerForm selectedWallet={selectedWallet} createCustomer={createCustomer} />

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
          <BatchEditCustomerForm 
            selectedWallet={null}
            selectedCustomers={null as unknown as CustomerType[]}
          />
        </ModalTemplate>
      )}
    </div>
  )
}

export default CustomerActionsBar
