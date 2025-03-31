import { CustomerType } from "@/context/BlockchainContext";
import { useBlockchain } from "@/hooks/useBlockchain";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { useParams } from 'react-router-dom';

const Customer = () => {
  const {customerName} = useParams();
  const {fetchedCustomers} = useBlockchain();
  const [customer, setCustomer] = useState<CustomerType | undefined>();

  useEffect(() => {
    if (!fetchedCustomers) return;
    setCustomer(fetchedCustomers.find((_customer) => _customer.name == customerName));
  }, [fetchedCustomers]);

  return (
    <div>
      <h3>Name: {customer?.name}</h3>
      <Link to="/">Home</Link>
    </div>
  )
}

export default Customer
