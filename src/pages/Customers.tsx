import CustomerManager from "@/components/CustomerManager"
import { Outlet } from "react-router-dom"

const Customers = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default Customers
