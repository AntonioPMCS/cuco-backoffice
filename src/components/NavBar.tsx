import { Link } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = () => {
  return (
    <div className="nav-bar">
      <Link to="/devices">Devices</Link> 
      <Link to="/municipalities">Municipalities</Link>
    </div>
  )
}

export default NavBar
