import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerType } from "@/context/CucoContext";
import { useCuco } from "@/hooks/useCuco";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useWalletProviders } from "@/hooks/useWalletProviders";
import { useIpfs } from "@/hooks/useIpfs";
import { truncateMiddle } from "../../utils";
import { Copy, Edit, Plus, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"
import { useParams } from 'react-router-dom';
import { CustomerInfoTab } from "./CustomerInfoTab";

const Customer = () => {
  const {customerName} = useParams();
  const {fetchedCustomers, addAdmin, removeAdmin} = useCuco();
  const handleCopyValue = useCopyToClipboard();
  const {selectedWallet} = useWalletProviders();
  const {buildUrl, data, loading: ipfsLoading, error: ipfsError, loadData} = useIpfs();
  const [customer, setCustomer] = useState<CustomerType | undefined>();
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedCustomer, setEditedCustomer] = useState<CustomerType | null>(null)
  const [newAdmin, setNewAdmin] = useState<string>("")
  const [activeTab, setActiveTab] = useState<'main' | 'deviceDefaults'>('main');
  // Store form changes in ref (no re-renders during editing)
  const formChangesRef = useRef<Record<string, string>>({});

  const handleSaveChanges = () => {
    if (editedCustomer) {
      // In a real app, you would make an API call here
      console.log(editedCustomer);
      //setCustomer(editedCustomer)
      setIsEditing(false)
    }
  } 


  // Handle field changes - store in ref only (no re-render)
  const handleFieldChange = (field: string, value: string) => {
    formChangesRef.current[field] = value;
  };


  const handleAddAddress = () => {
    if (!customer)
      return;
    console.log("New admin: "+newAdmin)
    // In a real app, you would make an API call here
    addAdmin(customer?.address, newAdmin)
  }

  const handleRemoveAddress = (address:string) => {
    if (!customer)
      return;
    console.log("Removing admin: "+address)
    // In a real app, you would make an API call here
    removeAdmin(customer?.address, address)
  }

  useEffect(() => {
    if (!fetchedCustomers) return;
    setLoading(false);
    setCustomer(fetchedCustomers.find((_customer) => _customer.name == customerName));
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
            <CardTitle className="text-2xl">{customer.name}</CardTitle>
            <CardDescription>
              {customer.parentName ? `Parent: ${customer.parentName}` : "No parent company"}
            </CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Details
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 border-b">
            <Button
              variant={activeTab === 'main' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('main')}
              className="rounded-none border-b-2 border-transparent"
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
              className="rounded-none border-b-2 border-transparent"
              style={activeTab === 'deviceDefaults' ? { 
                borderBottomColor: 'black', 
                color: 'black',
                backgroundColor: 'transparent'
              } : {}}
            >
              Device Defaults
            </Button>
          </div>

          {/* Tab Content */}
          {activeTab === 'main' && (
            <CustomerInfoTab
              customer={customer}
              isEditing={isEditing}
              onFieldChange={handleFieldChange}
              deviceMetadataURI={customer.deviceMetadata}
              buildUrl={buildUrl}
              onCopyValue={handleCopyValue}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Admin Accounts</CardTitle>
            <CardDescription>Wallet addresses with admin access to this Customer</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Admin Address</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="blockchain-address">Wallet Address</Label>
                  <Input
                    id="blockchain-address"
                    value={newAdmin}
                    onChange={(e) => setNewAdmin(e.target.value)}
                    placeholder="0x1234... or bc1q..."
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleAddAddress} disabled={selectedWallet ? false : true}>Add Address</Button>
                </DialogClose>
              </DialogFooter>
              {!selectedWallet && 
                <span className="text-red-500 text-sm text-right block">You must connect your wallet to transact with the blockchain</span>
              }
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {customer.authorizedUsers?.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No authorized users found. Add an address to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.authorizedUsers.map((address) => (
                  <TableRow key={address}>
                    <TableCell className="font-mono">{truncateMiddle(address)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyValue(address)}
                          title="Copy address"
                          className="cursor-pointer"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy address</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAddress(address)}
                          title="Remove address"
                          className="cursor-pointer"  
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove address</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>


      <Link to="/">{`<<< Home`}</Link>
    </div>
  )
}

export default Customer
