import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  FileAddOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  BarChartOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import AppRequest from '../../helpers/AppRequest';

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: 'home',
    icon: <DashboardOutlined />,
    label: 'Home',
    route: '/home',
  },
  
  {
    key: 'crear-pedidos',
    icon: <FileAddOutlined />,
    label: 'Crear Pedidos',
    route: '/crear-pedidos',
  },
  {
    key: 'mis-pedidos',
    icon: <ShoppingCartOutlined />,
    label: 'Mis Pedidos',
    route: '/mis-pedidos',
  },
  {
    key: 'proveedores',
    icon: <TeamOutlined />,
    label: 'Proveedores',
    route: '/proveedores',
  },
  {
    key: 'reportes',
    icon: <BarChartOutlined />,
    label: 'Reportes',
    route: '/reportes',
  },
];

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  // Manejar cambios de tamaño de pantalla
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = (e) => {
    const item = items.find((i) => i.key === e.key);
    if (item) {
      navigate(item.route);
    }
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const handleLogout = () => {
    AppRequest.logout();
    navigate('/login');
  };

  return (
    <>
      {isMobile && !collapsed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 99,
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setCollapsed(true)}
        />
      )}
      <Layout 
        style={{ 
          minHeight: '100vh',
          position: 'relative'
        }}
      >
      <Sider 
        collapsible={!isMobile}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        trigger={isMobile ? null : undefined}
        style={{
          position: isMobile ? 'fixed' : 'absolute',
          height: '100%',
          left: 0,
          top: 0,
          zIndex: 100,
          transition: 'all 0.2s ease'
        }}
      >
        <div className="demo-logo-vertical" style={{ 
          height: 40, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: token.borderRadius
        }} />
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: 'calc(100% - 72px)' // altura total - altura del logo
        }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[items.find((i) => i.route === location.pathname)?.key]}
            onClick={handleMenuClick}
            items={items}
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
      </Sider>
      <Layout style={{ 
        marginLeft: isMobile ? 0 : (collapsed ? '80px' : '200px'),
        transition: 'all 0.2s ease',
        position: 'relative',
        minHeight: '100vh'
      }}>
        <Header 
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
        </Header>
        <Content style={{ 
          margin: '16px',
          padding: '16px',
          minHeight: 'calc(100vh - 128px)',
          position: 'relative'
        }}>
          <div style={{ 
            padding: 24, 
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
            minHeight: '100%',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
          }}>
            {children}
          </div>
        </Content>
        <Footer style={{ 
          textAlign: 'center', 
          background: 'transparent',
          padding: '16px'
        }}>
          © Gestión de Pedidos - Todos los derechos reservados {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
    </>
  );
};

export default AppLayout;
