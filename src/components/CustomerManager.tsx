import { useState } from "react";
import { truncateMiddle } from "../utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { CustomerType } from "@/context/BlockchainContext";

import CustomerActionsBar from "./CustomerActionsBar";
import CustomerActionsDropdown from "./CustomerActionsDropdown";
import { useBlockchain } from "@/hooks/useBlockchain";

import { Link } from "react-router-dom";

const CustomerManager = () => {
  const { fetchedCustomers, createCustomer } = useBlockchain();
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [editCustomer, setEditCustomer] = useState<CustomerType | null>(null)

  const handleEditCustomer = () => {}
  const handleDeleteCustomer = (customerName:string) => {console.log(customerName)}

  const toggleSelectAll = () => {
    if (selectedCustomers.length === fetchedCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(fetchedCustomers.map((customer) => customer.name))
    }
  }

  const toggleCustomerSelection = (customerName:string) => {
    setSelectedCustomers((prev) => (prev.includes(customerName) ?
        prev.filter((customerName) => customerName !== customerName) :
        [...prev, customerName]
      ))
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-center gap-4">
        <CustomerActionsBar selectedCustomers={selectedCustomers} createCustomer={createCustomer}/>
        <div className="border rounded-md w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked = {selectedCustomers.length === fetchedCustomers.length && fetchedCustomers.length > 0 }
                    onCheckedChange = {toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contract Address</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetchedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No customers found. 
                    Ensure you're connected to sepolia on your wallet.
                    If you are, look at the browser console for errors.
                  </TableCell>
                </TableRow>
                ) : (
                  fetchedCustomers.map((customer) => (
                    <TableRow key={customer.name}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCustomers.includes(customer.name)}
                          onCheckedChange={() => toggleCustomerSelection(customer.name)}
                        />
                      </TableCell>
                      <TableCell>
                        <Link to={`/customers/${encodeURIComponent(customer.name)}`} >
                          {customer.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/customers/${encodeURIComponent(customer.name)}`} >
                          {truncateMiddle(customer.address)}
                        </Link>
                      </TableCell>
                      <TableCell>{customer.parent}</TableCell>
                      <TableCell>
                        <CustomerActionsDropdown 
                          editCustomer={editCustomer} setEditCustomer={setEditCustomer}
                          customer={customer}
                          handleEditCustomer={handleEditCustomer}
                          handleDeleteCustomer={handleDeleteCustomer}
                        />
                      </TableCell>
                    </TableRow>
                  )
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomerManager
