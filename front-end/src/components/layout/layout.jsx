import React, { useState, useEffect } from 'react';
import { Layout, theme } from 'antd';
import SideBar from './SideBar';
import HeaderBar from './HeaderBar';
import FooterBar from './FooterBar';
import Breadcrumbs from './BreadCrumps';
const { Sider, Content } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { token } = theme.useToken();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Fondo semitransparente cuando se abre el sidebar en móvil */}
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

      <Layout style={{ minHeight: '100vh', position: 'relative' }}>
        {/* SIDEBAR */}
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
          <SideBar collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} />
        </Sider>

        {/* CONTENIDO PRINCIPAL */}
        <Layout
          style={{
            marginLeft: isMobile ? 0 : collapsed ? '80px' : '200px',
            transition: 'all 0.2s ease',
            position: 'relative',
            minHeight: '100vh'
          }}
        >
          <HeaderBar isMobile={isMobile} collapsed={collapsed} setCollapsed={setCollapsed} />

          <Content
            style={{
              margin: '16px',
              padding: '16px',
              minHeight: 'calc(100vh - 128px)',
              position: 'relative'
            }}
          >
            <div
              style={{
                padding: 24,
                background: token.colorBgContainer,
                borderRadius: token.borderRadius,
                minHeight: '100%',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
              }}
            >
              <Breadcrumbs />
              {children}
            </div>
          </Content>

          <FooterBar />
        </Layout>
      </Layout>
    </>
  );
};

export default AppLayout;
