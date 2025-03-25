import { Link } from "react-router-dom";
import "../styles/NavBar.css";
import ConnectionBar from "./ConnectionBar";

const NavBar = () => {
  return (
    <div className="nav-bar">
      <div>
        <Link to="/devices">Devices</Link> 
        <Link to="/municipalities">Municipalities</Link>
      </div>
      <span className="navbar-info">Using Sepolia by default</span> 
      <ConnectionBar />
    </div>
  )
}

export default NavBar
