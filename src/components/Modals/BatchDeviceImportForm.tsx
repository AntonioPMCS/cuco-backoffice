import { Textarea } from "../ui/textarea";

interface BatchDeviceImportFormProps {
  batchDevices: string;
  setBatchDevices: (batchDevices:string) => void;
}


const BatchDeviceImportForm: React.FC<BatchDeviceImportFormProps> = ({batchDevices, setBatchDevices}) => {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Enter one device per line in the format: Serial Number, Customer Address, State
      </p>
      <Textarea
        placeholder="SN001, 0x5fc43...342B6, unlocked
        SN002, 0x2ad11...342F6, locked"
        value={batchDevices}
        onChange = {(e) => setBatchDevices(e.target.value)}
        rows={6}
      />
    </>
    
  )
}

export default BatchDeviceImportForm
