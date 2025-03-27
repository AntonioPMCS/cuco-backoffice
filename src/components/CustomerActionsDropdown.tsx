
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";
import { CustomerType } from "@/context/BlockchainContext";

interface CustomerActionsDropdownProps {
  editCustomer: CustomerType | null;
  setEditCustomer: (customer:CustomerType) => void;
  customer: CustomerType;
  handleEditCustomer: (arg0?:any) => void;
  handleDeleteCustomer: (arg0?:any) => void;
}

const CustomerActionsDropdown:React.FC<CustomerActionsDropdownProps> = ({editCustomer, setEditCustomer, customer, handleEditCustomer, handleDeleteCustomer}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Customer</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editCustomer?.name || customer.name}
                    onChange={(e) =>
                      setEditCustomer({
                        ...(editCustomer || customer),
                        name: e.target.value,
                      })
                    }
                    onClick={() => setEditCustomer(customer)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-parent">Parent</Label>
                  <Input
                    id="edit-parent"
                    value={editCustomer?.parent || customer.parent}
                    onChange={(e) =>
                      setEditCustomer({
                        ...(editCustomer || customer),
                        parent: e.target.value,
                      })
                    }
                    onClick={() => setEditCustomer(customer)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleEditCustomer}>Save Changes</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => handleDeleteCustomer(customer.address)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CustomerActionsDropdown
