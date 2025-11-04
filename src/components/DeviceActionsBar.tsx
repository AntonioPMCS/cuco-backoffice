import { useState } from "react";
import { Edit, Upload } from "lucide-react"
import ModalTemplate from "./Modals/ModalTemplate"
import AddDeviceForm from "./Modals/AddDeviceForm";
import BatchDeviceImportForm from "./Modals/BatchDeviceImportForm";
import BatchEditForm from "./Modals/BatchEditForm";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useWalletProviders } from "@/hooks/useWalletProviders";


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
  const {selectedWallet} = useWalletProviders()

  const handleBatchImport = () => {}
  const handleBatchEdit = () => {}
  
  return (
    <div className="flex items-center justify-between w-full px-8">
      <div className="flex items-center space-x-2">

        <AddDeviceForm addDevice={addDevice} selectedWallet={selectedWallet} />

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
