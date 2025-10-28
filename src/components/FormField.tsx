import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

interface FormFieldProps {
  label: string;
  field: string;
  value: string;
  type?: "text" | "select";
  options?: { label: string; value: string }[];
  isEditing: boolean;
  onFieldChange: (field: string, value: string) => void;
}

export const FormField = ({ 
  label, 
  field, 
  value, 
  type = "text", 
  options, 
  isEditing, 
  onFieldChange 
}: FormFieldProps) => {
  const [internalValue, setInternalValue] = useState(value);

  // Sync internal value with prop value when it changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Get the display value for select fields
  const getDisplayValue = () => {
    if (type === "select" && options) {
      const option = options.find(opt => opt.value === internalValue);
      return option ? option.label : internalValue;
    }
    return internalValue;
  };

  // Handle input changes
  const handleInputChange = (newValue: string) => {
    setInternalValue(newValue);
    onFieldChange(field, newValue);
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{label}</h3>
      {isEditing ? (
        type === "select" && options ? (
          <Select value={internalValue} onValueChange={handleInputChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input 
            value={internalValue} 
            onChange={(e) => handleInputChange(e.target.value)}
          />
        )
      ) : (
        <p className="text-base">{getDisplayValue()}</p>
      )}
    </div>
  );
};
