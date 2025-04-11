import { useState } from "react";
import { Edit, Plus, Upload } from "lucide-react"
import ModalTemplate from "./Modals/ModalTemplate"
import AddDeviceForm from "./Modals/AddDeviceForm";
import { DeviceType } from "@/context/BlockchainContext";
import BatchDeviceImportForm from "./Modals/BatchDeviceImportForm";
import BatchEditForm from "./Modals/BatchEditForm";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";


interface DeviceActionsBarProps {
  selectedDevices: string[];
  addDevice: (_customer:string, sn:string, _metadata:string ) => void;
  showHidden: boolean;
  setShowHidden: (hidden: boolean) => void;
}

const DeviceActionsBar:React.FC<DeviceActionsBarProps> = ({selectedDevices, addDevice, showHidden, setShowHidden}) => {
  const [batchDevices, setBatchDevices] = useState<string>("")
  const [batchEditProperty, setBatchEditProperty] = useState<string>("")
  const [batchEditValue, setBatchEditValue] = useState<string>("")
  const [newDevice, setNewDevice] = useState<DeviceType>({
    address: "",
    sn: "",
    customer: "",
    deviceState: 1,
    metadata: "QmNPyntq8DLiV1M6ru9CVixpEvuhmwTbJytPARoEjMqDPN/35eaffe809a27639951d8e36c57a1c3f784cbe3855b309ebe3708c532b4bda46.json",
    visible: true
  })

  const handleAddDevice = () => {
    addDevice(newDevice.customer, newDevice.sn, newDevice.metadata);
  }

  const handleBatchImport = () => {}
  const handleBatchEdit = () => {}
  
  return (
    <div className="flex items-center justify-between w-full px-8">
      <div className="flex items-center space-x-2">
        <ModalTemplate 
          trigger={<><Plus className="mr-2 h-4 w-4" />Add Device</>}
          title="Add New Device"
          handler={handleAddDevice}
          description={"Fill device SN and customer to add a new device"}
        >
          <AddDeviceForm newDevice = {newDevice} setNewDevice = {setNewDevice} />
        </ModalTemplate>

        <ModalTemplate
          trigger={<><Upload className="mr-2 h-4 w-4" />BatchImport</>}
          title="Batch Import Devices"
          handler={handleBatchImport}
        >
          <BatchDeviceImportForm batchDevices={batchDevices} setBatchDevices={setBatchDevices} />
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
      <div className="flex items-center space-x-2 ">
        <Switch id="show-hidden" checked={showHidden} onCheckedChange={setShowHidden} />
        <Label htmlFor="show-hidden">Show Removed</Label>
      </div>
    </div>
  )
}

export default DeviceActionsBar
