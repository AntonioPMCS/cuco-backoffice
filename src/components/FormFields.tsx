import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Check, Edit, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useWalletProviders } from "@/hooks/useWalletProviders";


// Render a field with inline edit functionality
export const RenderEditableText = ({ label, field, value, handleSave }: 
  { label: string, field: string, value: string, handleSave:(field:string, newValue:string)=>void }) => {
  const [tempValue, setTempValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const {selectedWallet} = useWalletProviders();

  // Handle edit button click
  const handleEdit = () => {
    setIsEditing(true);
  }

  // Handle cancel button click
  const handleCancel = () => {
    setIsEditing(false);
  }

  const handleSaveActions = () => {
    handleSave(field, tempValue);
    setIsEditing(false);
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{label}</h3>
      <div className="flex items-center gap-2 group">
        {isEditing ? (
          <>
            <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="flex-1" autoFocus />
            <Button 
              disabled={selectedWallet? false : true} size="icon" variant="ghost" 
              onClick={handleSaveActions} className="h-8 w-8"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </> 
        ) : (
          <>
            <p className="text-base flex-1">{value}</p>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleEdit}
              className="h-8 w-8 opacity-100"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {!selectedWallet && isEditing && 
        <span className="text-red-500 text-sm text-right block">Connect a wallet to transact with the blockchain</span>
      }
    </div>
  )
}

export const RenderEditableDropdown = ({ label, field, value, handleSave, options }: 
  { label: string, field: string, value: string, handleSave:(field:string, newValue:string)=>void, options: { label: string, value: string }[] }) => {
  const [tempValue, setTempValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const {selectedWallet} = useWalletProviders();

  // Handle edit button click
  const handleEdit = () => {
    setIsEditing(true);
  }

  // Handle cancel button click
  const handleCancel = () => {
    setIsEditing(false);
  }

  const handleSaveActions = () => {
    handleSave(field, tempValue);
    setIsEditing(false);
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{label}</h3>
      <div className="flex items-center gap-2 group">
        {isEditing ? (
          <>
            <Select value={tempValue} onValueChange={setTempValue} defaultOpen>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              disabled={selectedWallet ? false : true} size="icon" variant="ghost" 
              onClick={handleSaveActions} className="h-8 w-8">
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <p className="text-base flex-1">{options.find((option) => option.value === value)?.label || value}</p>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleEdit}
              className="h-8 w-8 opacity-100"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {!selectedWallet && isEditing && 
        <span className="text-red-500 text-sm italic text-left block">Connect a wallet to transact with the blockchain</span>
      }
    </div>
  )
}