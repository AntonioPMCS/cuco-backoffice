import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  // Get the display value for select fields
  const getDisplayValue = () => {
    if (type === "select" && options) {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{label}</h3>
      {isEditing ? (
        type === "select" && options ? (
          <Select value={value} onValueChange={(newValue) => onFieldChange(field, newValue)}>
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
            value={value} 
            onChange={(e) => onFieldChange(field, e.target.value)}
          />
        )
      ) : (
        <p className="text-base">{getDisplayValue()}</p>
      )}
    </div>
  );
};
