import { Textarea } from "../ui/textarea";

interface BatchCustomerImportFormProps {
  batchCustomers: string;
  setBatchCustomers: (batchCustomers:string) => void;
}


const BatchCustomerImportForm: React.FC<BatchCustomerImportFormProps> = ({batchCustomers, setBatchCustomers}) => {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Enter one customer per line in the format: Name, Parent Address
      </p>
      <Textarea
        placeholder="Fundão, 0xc0ffee254729296a45a3885639AC7E10F9d54979
        Resende, 0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E"
        value={batchCustomers}
        onChange = {(e) => setBatchCustomers(e.target.value)}
        rows={6}
      />
    </>
    
  )
}

export default BatchCustomerImportForm
