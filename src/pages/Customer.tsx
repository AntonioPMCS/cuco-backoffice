import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerType } from "@/context/BlockchainContext";
import { useBlockchain } from "@/hooks/useBlockchain";
import { truncateMiddle } from "@/utils";
import { Copy, Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { useParams } from 'react-router-dom';
import { toast } from "sonner";

const Customer = () => {
  const {customerName} = useParams();
  const {fetchedCustomers} = useBlockchain();
  const [customer, setCustomer] = useState<CustomerType | undefined>();
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedCustomer, setEditedCustomer] = useState<CustomerType | null>(null)
  const [newAdmin, setNewAdmin] = useState<string>("")

  const handleSaveChanges = () => {
    if (editedCustomer) {
      // In a real app, you would make an API call here
      console.log(editedCustomer);
      //setCustomer(editedCustomer)
      setEditing(false)
    }
  } 

  const handleAddAddress = () => {
    console.log("New admin: "+newAdmin)
    // In a real app, you would make an API call here
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast("Address copied", {
      description: `${address} " has been copied to your clipboard`,
      duration: 3000,
    })
  }

  useEffect(() => {
    if (!fetchedCustomers) return;
    setLoading(false);
    setCustomer(fetchedCustomers.find((_customer) => _customer.name == customerName));
  }, [fetchedCustomers]);

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
          {!editing && (
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Details
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editedCustomer?.name || ""}
                    onChange={(e) => setEditedCustomer((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentName">Parent Name</Label>
                  <Input
                    id="parentName"
                    value={editedCustomer?.parentName || ""}
                    onChange={(e) =>
                      setEditedCustomer((prev) => (prev ? { ...prev, parentName: e.target.value } : null))
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={editedCustomer?.address || ""}
                    onChange={(e) => setEditedCustomer((prev) => (prev ? { ...prev, address: e.target.value } : null))}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false)
                    setEditedCustomer(customer)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                  <p className="text-base">{customer.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Parent Name</h3>
                  <p className="text-base">{customer.parentName || "N/A"}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                  <p className="text-base">{customer.address}</p>
                </div>
              </div>
            </div>
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
                  <Button onClick={handleAddAddress}>Add Address</Button>
                </DialogClose>
              </DialogFooter>
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
                          onClick={() => handleCopyAddress(address)}
                          title="Copy address"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy address</span>
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


      <Link to="/">Home</Link>
    </div>
  )
}

export default Customer
