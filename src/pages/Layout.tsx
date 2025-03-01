import React from 'react';
import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';
import '../styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ }: LayoutProps) => {
  return (
    <div className="app-container">
        <NavBar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;