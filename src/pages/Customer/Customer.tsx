import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerType } from "@/context/CucoContext";
import { useCuco } from "@/hooks/useCuco";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useWalletProviders } from "@/hooks/useWalletProviders";
import { useIpfs } from "@/hooks/useIpfs";
import { Edit } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"
import { useParams } from 'react-router-dom';
import { CustomerInfoTab } from "./CustomerInfoTab";
import { CustomerDeviceDefaultsTab } from "./CustomerDeviceDefaultsTab";
import { CustomerAdminAccounts } from "./CustomerAdminAccounts";

const Customer = () => {
  const {customerAddress} = useParams();
  const {fetchedCustomers, setCustomerName, addAdmin, removeAdmin, setCustomerDeviceMetadata} = useCuco();
  const handleCopyValue = useCopyToClipboard();
  const {selectedWallet} = useWalletProviders();
  const {data, loading: ipfsLoading, error: ipfsError, loadData, uploadToIpfs, clearData, buildUrl} = useIpfs();
  const [customer, setCustomer] = useState<CustomerType | undefined>();
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'main' | 'deviceDefaults' | 'adminAccounts'>('main');
  // Store form changes in ref (no re-renders during editing)
  const formChangesRef = useRef<Record<string, string>>({});

  // Handle field changes - store in ref only (no re-render)
  const handleFieldChange = (field: string, value: string) => {
    formChangesRef.current[field] = value;
  };

  // Handle save all changes
  const handleSaveAll = async () => {
    console.log("Hello from Save button!");
    console.log("Form changes:", formChangesRef.current);
    console.log("Original customer data:", customer);
    
    if (!customer) return;
    setLoading(true);

    try {
      const changes = formChangesRef.current; // Read all changes from ref
      console.log("Changes:", changes);


      // 1) customerName 
      if (changes.name !== undefined) {
        const newName = changes.name;
        if (newName != customer.name) {
          await setCustomerName(newName, customer.address);
        }
      }



      // Filter out non-metadata fields (name, parentName, address are not updatable on-chain)
      const metadataChanges: Record<string, string> = {};
      Object.entries(changes).forEach(([key, value]) => {
        if (!["name", "parentName", "address"].includes(key)) {
          metadataChanges[key] = value;
        }
      });

      // Save metadata changes to IPFS if any
      if (Object.keys(metadataChanges).length > 0) {
        // Rebuild the metadata object with all fields, using changes if available, otherwise existing data
        const metadata = {
          IT: changes.IT ?? data?.IT ?? "",
          BT: changes.BT ?? data?.BT ?? "",
          BW: changes.BW ?? data?.BW ?? "",
          TW: changes.TW ?? data?.TW ?? "",
          MaxUC: changes.MaxUC ?? data?.MaxUC ?? "",
          ticketlifetime: changes.ticketlifetime ?? data?.ticketlifetime ?? ""
        };
       
        const metadataURI = await uploadToIpfs(metadata);
        if (metadataURI) {
          try {
            await setCustomerDeviceMetadata(customer.address, metadataURI);
            clearData();
            loadData(metadataURI);
          } catch (error) {
            console.error("Error uploading device metadata:", error);
          }
        }
      }

    } catch (err) {
      console.error("Save error:", err);
    } finally {
      // Clear form changes regardless of outcome
      formChangesRef.current = {};
      setIsEditing(false);
      setLoading(false);
    }
  };



  useEffect(() => {
    if (!fetchedCustomers) return;
    setLoading(false);
    setCustomer(fetchedCustomers.find((_customer) => _customer.address == customerAddress));
  }, [fetchedCustomers]);

  useEffect(() => {
    if (customer?.deviceMetadata && !data) {
      loadData(customer.deviceMetadata);
    }
  }, [customer?.deviceMetadata, data, loadData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">Customer Not Found</h2>
        <p className="text-muted-foreground">The customer you are looking for does not exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl">Customer: {customer.name}</CardTitle>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => {
                setIsEditing(true);
                formChangesRef.current = {}; // Initialize empty ref when entering edit mode
              }} variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit Details
              </Button>
            ) : (
              <div className="flex flex-col items-end">
                <div className="flex gap-2">
                  <Button onClick={handleSaveAll} disabled={loading || !selectedWallet}>
                    {loading ? "Saving..." : "Save"}
                  </Button>
                  <Button onClick={() => {
                    setIsEditing(false);
                    formChangesRef.current = {}; // Clear unsaved changes
                  }} variant="outline">
                    Cancel
                  </Button>
                </div>
                {!selectedWallet && (
                  <p className="text-xs text-red-500 mt-1">
                    Connect a wallet to transact with the blockchain
                  </p>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 border-b">
            <Button
              variant={activeTab === 'main' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('main')}
              className="rounded-none border-b-2 border-transparent cursor-pointer"
              style={activeTab === 'main' ? { 
                borderBottomColor: 'black', 
                color: 'black',
                backgroundColor: 'transparent'
              } : {}}
            >
              Customer Info
            </Button>
            <Button
              variant={activeTab === 'deviceDefaults' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('deviceDefaults')}
              className="rounded-none border-b-2 border-transparent cursor-pointer"
              style={activeTab === 'deviceDefaults' ? { 
                borderBottomColor: 'black', 
                color: 'black',
                backgroundColor: 'transparent'
              } : {}}
            >
              Device Defaults
            </Button>
            <Button
              variant={activeTab === 'adminAccounts' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('adminAccounts')}
              className="rounded-none border-b-2 border-transparent cursor-pointer"
              style={activeTab === 'adminAccounts' ? { 
                borderBottomColor: 'black', 
                color: 'black',
                backgroundColor: 'transparent'
              } : {}}
            >
              Admin Accounts
            </Button>
          </div>

          {/* Tab Content */}
          {activeTab === 'main' && (
            <CustomerInfoTab
              customer={customer}
              isEditing={isEditing}
              onFieldChange={handleFieldChange}
              onCopyValue={handleCopyValue}
              deviceMetadataURI={customer.deviceMetadata}
              buildUrl={buildUrl}
            />
          )}

          {activeTab === 'deviceDefaults' && (
            <CustomerDeviceDefaultsTab
              deviceMetadataURI={customer.deviceMetadata}
              ipfsLoading={ipfsLoading}
              ipfsError={ipfsError}
              data={data}
              isEditing={isEditing}
              onFieldChange={handleFieldChange}
            />
          )}

          {activeTab === 'adminAccounts' && (
            <CustomerAdminAccounts
              customer={customer}
              addAdmin={addAdmin}
              removeAdmin={removeAdmin}
              selectedWallet={selectedWallet}
              onCopyValue={handleCopyValue}
            />
          )}
        </CardContent>
      </Card>


      <Link to="/">{`<<< Home`}</Link>
    </div>
  )
}

export default Customer
