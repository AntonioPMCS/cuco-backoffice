import { createBrowserRouter } from "react-router-dom";
import Layout from "@/pages/Layout";
import NotFoundPage from "@/pages/NotFound";
import Devices from "@/pages/Devices";
import Customers from "@/pages/Customers";
import Customer from "@/pages/Customer";
import CustomerManager from "@/components/CustomerManager";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout children />,
    errorElement: <NotFoundPage />, 
    children: [
      { path: "/", element: <Navigate to="/devices" replace /> },
      { path: "/devices", element: <Devices /> },
      { 
        path: "/customers", 
        element: <Customers />, 
        children: [
          { index: true, element: <CustomerManager />},
          { path: ":customerName", element: <Customer />}  // dynamic segment for customer name
        ]
    }
    ]
  }
])

export default router;