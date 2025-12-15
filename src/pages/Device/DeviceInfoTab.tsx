import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import { DeviceType } from "@/context/CucoContext";
import { DEVICE_STATE_OPTIONS } from "@/constants/deviceStates";
import { Copy } from "lucide-react";
import { truncateMiddle } from "../../utils";

interface DeviceInfoTabProps {
  device: DeviceType;
  isEditing: boolean;
  onFieldChange: (field: string, value: string) => void;
  customerName: string;
  metadataURI?: string;
  buildUrl: (uri: string) => string;
  onCopyValue: (value: string) => void;
}

export const DeviceInfoTab = ({
  device,
  isEditing,
  onFieldChange,
  customerName,
  metadataURI,
  buildUrl,
  onCopyValue,
}: DeviceInfoTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField 
          label="Serial Number" 
          field="sn" 
          value={device.sn}
          isEditing={isEditing}
          onFieldChange={onFieldChange}
        />
        <FormField
          label="State" 
          field="deviceState" 
          value={device.deviceState?.toString() ?? "0"}
          type="select"
          options={DEVICE_STATE_OPTIONS}
          isEditing={isEditing}
          onFieldChange={onFieldChange}
        />
        <FormField
          label="Visible" 
          field="visible" 
          value={device.visible?.toString() ?? "false"}
          type="select"
          options={[
            {label: "True", value: "true"},
            {label: "False", value: "false"}
          ]}
          isEditing={isEditing}
          onFieldChange={onFieldChange}
        />
        <FormField
          label="Belongs to customer" 
          field="customer" 
          value={customerName}
          isEditing={isEditing}
          onFieldChange={onFieldChange}
        />
        <div className="md:col-span-1">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Device Contract (immutable)</h3>
          <p className="text-base">{device.address}</p>
        </div>
      </div>
      
      {/* Metadata URL in Main tab for quick access */}
      {metadataURI && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Metadata URI</h3>
          <div className="flex items-center gap-2">
            <p className="text-base">
              <a 
                href={buildUrl(metadataURI)} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {truncateMiddle(metadataURI)}
              </a>
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-pointer"
              onClick={() => onCopyValue(metadataURI)}
              title="Copy URI"
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy URI</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

