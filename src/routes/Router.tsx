import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import NotFoundPage from "../pages/NotFound";
import Devices from "../pages/Devices";
import Municipalities from "../pages/Municipalities";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout children />,
    errorElement: <NotFoundPage />, 
    children: [
      { path: "/", element: <Navigate to="/devices" replace /> },
      { path: "/devices", element: <Devices /> },
      { path: "/municipalities", element: <Municipalities />}
    ]
  }
])

export default router;