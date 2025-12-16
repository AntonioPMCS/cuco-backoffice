import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerType } from "@/context/CucoContext";
import { Copy, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { truncateMiddle } from "../../utils";

interface CustomerAdminAccountsProps {
  customer: CustomerType;
  addAdmin: (customerAddress: string, newAdmin: string) => void;
  removeAdmin: (customerAddress: string, adminAddress: string) => void;
  selectedWallet: any;
  onCopyValue: (value: string) => void;
}

export const CustomerAdminAccounts = ({
  customer,
  addAdmin,
  removeAdmin,
  selectedWallet,
  onCopyValue,
}: CustomerAdminAccountsProps) => {
  const [newAdmin, setNewAdmin] = useState<string>("");

  const handleAddAddress = () => {
    if (!customer) return;
    console.log("New admin: " + newAdmin);
    addAdmin(customer.address, newAdmin);
    setNewAdmin(""); // Clear input after adding
  };

  const handleRemoveAddress = (address: string) => {
    if (!customer) return;
    console.log("Removing admin: " + address);
    removeAdmin(customer.address, address);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Admin Accounts</h3>
          <p className="text-sm text-muted-foreground">Wallet addresses with admin access to this Customer</p>
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
                <Button onClick={handleAddAddress} disabled={selectedWallet ? false : true}>
                  Add Address
                </Button>
              </DialogClose>
            </DialogFooter>
            {!selectedWallet && (
              <span className="text-red-500 text-sm text-right block">
                You must connect your wallet to transact with the blockchain
              </span>
            )}
          </DialogContent>
        </Dialog>
      </div>
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
                      onClick={() => onCopyValue(address)}
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
    </div>
  );
};

