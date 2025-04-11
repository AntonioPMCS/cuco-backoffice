import React from 'react';
import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';
import '../styles/Layout.css';
import eu_logo from "../assets/uniao_europeia_logo.png";
import pt_logo from "../assets/republica_portuguesa_logo.png"
import prr_logo from "../assets/prr_logo.jfif"
import softi9_logo from "../assets/softi9_logo.png"

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ }: LayoutProps) => {
  return (
    <div className="app-container">
        <NavBar />
      <div className="content w-full">
        <Outlet />
      </div>
      <div className="footer flex items-center justify-between mt-10 space-x-10">
        <img src={softi9_logo} className="h-10 max-h-12 object-contain" alt="SoftI9 logo" />
        <img src={prr_logo} className="h-10 max-h-12 object-contain" alt="PRR logo" />
        <img src={pt_logo} className="h-10 max-h-12 object-contain" alt="PT logo" />
        <img src={eu_logo} className="h-10 max-h-12 object-contain" alt="EU logo" />
      </div>

    </div>
  );
}

export default Layout;