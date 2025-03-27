import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import NotFoundPage from "../pages/NotFound";
import Devices from "../pages/Devices";
import Customers from "../pages/Customers";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout children />,
    errorElement: <NotFoundPage />, 
    children: [
      { path: "/", element: <Navigate to="/devices" replace /> },
      { path: "/devices", element: <Devices /> },
      { path: "/customers", element: <Customers />}
    ]
  }
])

export default router;