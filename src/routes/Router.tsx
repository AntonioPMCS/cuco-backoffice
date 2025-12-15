import { createBrowserRouter } from "react-router-dom";
import Layout from "@/pages/Layout";
import NotFoundPage from "@/pages/NotFound";
import Devices from "@/pages/Devices";
import Customers from "@/pages/Customers";
import Customer from "@/pages/Customer/Customer";
import CustomerManager from "@/components/CustomerManager";
import { Navigate } from "react-router-dom";
import DeviceManager from "@/components/DeviceManager";
import Device from "@/pages/Device/Device";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout children />,
    errorElement: <NotFoundPage />, 
    children: [
      { path: "/", element: <Navigate to="/devices" replace /> },
      { 
        path: "/devices", 
        element: <Devices />,
        children: [
          { index: true, element: <DeviceManager />},
          { path: ":deviceSN", element: <Device />}  // dynamic segment for customer name
        ]
      },
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