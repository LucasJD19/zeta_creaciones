// src/layout/HeaderBar.jsx
import React from 'react';
import { Button, theme } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const HeaderBar = ({ isMobile, collapsed, setCollapsed }) => {
  const { token } = theme.useToken();

  return (
    <header
      style={{
        padding: '0 16px',
        background: token.colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        width: '100%'
      }}
    >
      {isMobile && (
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: '16px', width: 64, height: 64 }}
        />
      )}
    </header>
  );
};

export default HeaderBar;
