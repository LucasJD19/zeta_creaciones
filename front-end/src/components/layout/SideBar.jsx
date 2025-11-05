// src/layout/Sidebar.jsx
import React from 'react';
import { Menu, Button, theme } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import layoutItems from './layoutItems';
import AppRequest from '../../helpers/AppRequest' 

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
      <div className="demo-logo-vertical"
        style={{
          height: 40,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: token.borderRadius
        }}
      />
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
