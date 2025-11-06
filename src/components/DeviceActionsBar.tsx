import { useState } from "react";
import { Upload } from "lucide-react"
import ModalTemplate from "./Modals/ModalTemplate"
import AddDeviceForm from "./Modals/AddDeviceForm";
import BatchDeviceImportForm from "./Modals/BatchDeviceImportForm";
import BatchEditDeviceForm from "./Modals/BatchEditDeviceForm";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useWalletProviders } from "@/hooks/useWalletProviders";
import { DeviceType } from "@/context/CucoContext";


interface DeviceActionsBarProps {
  selectedDevices: DeviceType[];
  addDevice: (_customer:string, sn:string, _metadata:string ) => void;
  showHidden: boolean;
  setShowHidden: (hidden: boolean) => void;
}

const DeviceActionsBar:React.FC<DeviceActionsBarProps> = ({selectedDevices, addDevice, showHidden, setShowHidden}) => {
  const [batchDevices, setBatchDevices] = useState<string>("")
  const {selectedWallet} = useWalletProviders()

  const handleBatchImport = () => {}
  
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
          <BatchEditDeviceForm 
            selectedWallet={selectedWallet}
            selectedDevices={selectedDevices}
          />
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
