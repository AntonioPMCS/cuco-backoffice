import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import { CustomerType } from "@/context/CucoContext";
import { Copy } from "lucide-react";
import { truncateMiddle } from "../../utils";
import { ETHERSCAN_ADDRESS_URL } from "@/constants/Urls";

interface CustomerInfoTabProps {
  customer: CustomerType;
  isEditing: boolean;
  onFieldChange: (field: string, value: string) => void;
  deviceMetadataURI?: string;
  buildUrl: (uri: string) => string;
  onCopyValue: (value: string) => void;
}

export const CustomerInfoTab = ({
  customer,
  isEditing,
  onFieldChange,
  deviceMetadataURI,
  buildUrl,
  onCopyValue,
}: CustomerInfoTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField 
          label="Name" 
          field="name" 
          value={customer.name}
          isEditing={isEditing}
          onFieldChange={onFieldChange}
        />
        <FormField 
          label="Parent Name" 
          field="parentName" 
          value={customer.parentName || ""}
          isEditing={isEditing}
          onFieldChange={onFieldChange}
        />
        {isEditing ? (
          <FormField 
            label="Address" 
            field="address" 
            value={customer.address}
            isEditing={isEditing}
            onFieldChange={onFieldChange}
          />
        ) : (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
            <div className="flex items-center gap-2">
              <a 
                href={`${ETHERSCAN_ADDRESS_URL}${customer.address}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <p className="text-base">{truncateMiddle(customer.address)}</p>
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 cursor-pointer"
                onClick={() => onCopyValue(customer.address)}
                title="Copy address"
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy address</span>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Device Metadata URI in Main tab for quick access */}
      {deviceMetadataURI && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Device Metadata URI</h3>
          <div className="flex items-center gap-2">
            <p className="text-base">
              <a 
                href={buildUrl(deviceMetadataURI)} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {truncateMiddle(deviceMetadataURI)}
              </a>
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-pointer"
              onClick={() => onCopyValue(deviceMetadataURI)}
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

