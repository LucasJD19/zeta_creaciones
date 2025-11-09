import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import layoutItems from './layoutItems';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);

  // Mapeo de rutas con etiquetas legibles
  const routeMap = {};
  layoutItems.forEach(item => {
    if (item.route) routeMap[item.route] = item.label;
    if (item.children) {
      item.children.forEach(child => {
        routeMap[child.route] = child.label;
      });
    }
  });

  const breadcrumbItems = [
    {
      title: <Link to="/home">Home</Link>,
    },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const label = routeMap[url] || url.replace('/', '');
 const isLast = index === pathSnippets.length - 1;
const hasRoute = routeMap[url];

     return {
       title: isLast || !hasRoute ? (
        <span>{label}</span>
        ) : (
        <Link to={url}>{label}</Link>
       ),
     };
    }),
  ];

  return (
    <Breadcrumb
      items={breadcrumbItems}
      style={{ marginBottom: 16, fontWeight: 500 }}
    />
  );
};

export default Breadcrumbs;
