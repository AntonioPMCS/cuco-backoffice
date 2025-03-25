import { useState } from "react";
import { Edit, Plus, Upload } from "lucide-react"
import ModalTemplate from "./Modals/ModalTemplate"
import AddDeviceForm from "./Modals/AddDeviceForm";
import { DeviceType } from "@/hooks/useBlockchain";
import BatchImportForm from "./Modals/BatchImportForm";
import BatchEditForm from "./Modals/BatchEditForm";

interface DeviceActionsBarProps {
  selectedDevices: string[];
}

const DeviceActionsBar:React.FC<DeviceActionsBarProps> = ({selectedDevices}) => {
  const [batchDevices, setBatchDevices] = useState<string>("")
  const [batchEditProperty, setBatchEditProperty] = useState<string>("")
  const [batchEditValue, setBatchEditValue] = useState<string>("")
  const [newDevice, setNewDevice] = useState<DeviceType>({
    sn: "",
    customer: "",
    locked: false,
  })

  const handleAddDevice = () => {console.log(newDevice)}
  const handleBatchImport = () => {}
  const handleBatchEdit = () => {}
  
  return (
    <div className="flex items-center gap-2">
      <ModalTemplate 
        trigger={<><Plus className="mr-2 h-4 w-4" />Add Device</>}
        title="Add New Device"
        handler={handleAddDevice}
      >
        <AddDeviceForm newDevice = {newDevice} setNewDevice = {setNewDevice} />
      </ModalTemplate>

      <ModalTemplate
        trigger={<><Upload className="mr-2 h-4 w-4" />BatchImport</>}
        title="Batch Import Devices"
        handler={handleBatchImport}
      >
        <BatchImportForm batchDevices={batchDevices} setBatchDevices={setBatchDevices} />
      </ModalTemplate>

      {selectedDevices.length > 0 && (
        <ModalTemplate
          trigger={<><Edit className="mr-2 h-4 w-4" />Batch Edit {selectedDevices.length}</>}
          title="Batch Edit Devices"
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

export default DeviceActionsBar
