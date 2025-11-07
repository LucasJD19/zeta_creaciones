// src/layout/Sidebar.jsx
import React from 'react';
import { Menu, Button, theme } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import layoutItems from './layoutItems';
import AppRequest from '../../helpers/AppRequest' 
import pedidosIcon from '../../../src/assets/pedidos_icon.gif'; // ajustá la ruta según tu estructura
import './sidebar.css';


const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const findItemByKey = (items, key) => {
  for (const item of items) {
    if (item.key === key) return item;
    if (item.children) {
      const found = findItemByKey(item.children, key);
      if (found) return found;
    }
  }
  return null;
};

const handleMenuClick = (e) => {
  const item = findItemByKey(layoutItems, e.key);
  if (item && item.route) {
    navigate(item.route);
    if (isMobile) setCollapsed(true);
  }
};

const handleLogout = () => {
  AppRequest.logout();
  navigate('/login');
};

  return (
    <>
        {/* GIF de pedidos arriba */}
      <div className="sidebar-logo-container">
        <img src={pedidosIcon} alt="Pedidos Icon" className="sidebar-logo-gif" />
      </div>


      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100% - 72px)',
      }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[layoutItems.find(i => i.route === location.pathname)?.key]}
          onClick={handleMenuClick}
          items={layoutItems}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            margin: '16px',
            width: collapsed ? '80%' : 'calc(100% - 32px)',
            alignSelf: 'center'
          }}
        >
          {!collapsed && 'Cerrar Sesión'}
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
