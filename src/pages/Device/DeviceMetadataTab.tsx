import { FormField } from "@/components/FormField";

interface DeviceMetadataTabProps {
  metadataURI?: string;
  ipfsLoading: boolean;
  ipfsError: string | null;
  data: any;
  isEditing: boolean;
  onFieldChange: (field: string, value: string) => void;
}

export const DeviceMetadataTab = ({
  metadataURI,
  ipfsLoading,
  ipfsError,
  data,
  isEditing,
  onFieldChange,
}: DeviceMetadataTabProps) => {
  if (!metadataURI) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No metadata available for this device.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ipfsLoading && (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">Loading metadata...</span>
        </div>
      )}

      {ipfsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-red-800 font-medium mb-2">Error loading metadata</h4>
          <p className="text-red-600 text-sm">{ipfsError}</p>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data).map(([key, value]) => (
            <FormField
              key={key}
              label={key}
              field={key}
              value={typeof value === 'object' ? JSON.stringify(value) : String(value)}
              isEditing={isEditing}
              onFieldChange={onFieldChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

