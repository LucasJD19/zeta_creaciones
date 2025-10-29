// src/layout/layoutItems.js
import {
  FileAddOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  BarChartOutlined,
  InboxOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
   FolderOpenOutlined,
  TagOutlined
} from '@ant-design/icons';

const layoutItems = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: 'Home',
    route: '/home',
  },
  {
    key: 'productos',
    icon: <InboxOutlined />,
    label: 'Productos',
    children: [
      {
        key: 'gestion-productos',
        icon: <ShoppingOutlined />,
        label: 'Gestión de Productos',
        route: '/productos/gestion',
      }
    ],
  },
  {
    key: 'crear-pedidos',
    icon: <FileAddOutlined />,
    label: 'Crear Pedidos',
    route: '/crear-pedidos',
  },
  {
    key: 'pedidos',
    icon: <FolderOpenOutlined />,
    label: 'Pedidos',
    children: [
      {
        key: '/mis-pedidos',
        icon: <ShoppingCartOutlined />,
        label: 'Mis Pedidos',
        route: '/mis-pedidos',
      },
      {
        key: '/historial-pedidos',
        icon: <ClockCircleOutlined />,
        label: 'Historial de Pedidos',
        route: '/historial-pedidos',
      },
    ],
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

export default layoutItems;
