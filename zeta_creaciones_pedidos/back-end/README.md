# Backend Zeta Creaciones

API REST para el sistema de gestión de pedidos de Zeta Creaciones.

## Requisitos Previos

- Node.js (versión 14 o superior)
- MySQL (versión 8 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
\`\`\`bash
git clone https://github.com/Lucas-GitHubb/zeta_creaciones_pedidos.git
cd zeta_creaciones_pedidos/back-end
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

3. Configurar variables de entorno:
   - Copiar el archivo .env.example a .env
   - Modificar las variables según tu entorno

4. Crear la base de datos:
   - Ejecutar el script SQL proporcionado para crear la base de datos y las tablas

## Ejecución

### Desarrollo
\`\`\`bash
npm run dev
\`\`\`

### Producción
\`\`\`bash
npm start
\`\`\`

## Endpoints

### Autenticación
- POST /auth/login - Iniciar sesión

### Pedidos
- GET /pedidos - Obtener todos los pedidos
- GET /pedidos/:id - Obtener un pedido específico
- POST /pedidos - Crear nuevo pedido
- PUT /pedidos/:id - Actualizar pedido
- DELETE /pedidos/:id - Eliminar pedido
- GET /pedidos/cliente/:id_cliente - Obtener pedidos por cliente
- GET /pedidos/estado/:estado - Obtener pedidos por estado

### Clientes
- GET /clientes - Obtener todos los clientes
- GET /clientes/:id - Obtener un cliente específico
- POST /clientes - Crear nuevo cliente
- PUT /clientes/:id - Actualizar cliente
- DELETE /clientes/:id - Eliminar cliente

### Productos
- GET /productos - Obtener todos los productos
- GET /productos/:id - Obtener un producto específico
- POST /productos - Crear nuevo producto
- PUT /productos/:id - Actualizar producto
- DELETE /productos/:id - Eliminar producto

### Proveedores
- GET /proveedores - Obtener todos los proveedores
- GET /proveedores/:id - Obtener un proveedor específico
- POST /proveedores - Crear nuevo proveedor
- PUT /proveedores/:id - Actualizar proveedor
- DELETE /proveedores/:id - Eliminar proveedor

### Pagos
- GET /pagos - Obtener todos los pagos
- GET /pagos/:id - Obtener un pago específico
- POST /pagos - Crear nuevo pago
- PUT /pagos/:id - Actualizar pago
- DELETE /pagos/:id - Eliminar pago

### Envíos
- GET /envios - Obtener todos los envíos
- GET /envios/:id - Obtener un envío específico
- POST /envios - Crear nuevo envío
- PUT /envios/:id - Actualizar envío
- DELETE /envios/:id - Eliminar envío

## Seguridad

- Todas las rutas (excepto /auth/login) requieren autenticación mediante JWT
- Enviar el token en el header: Authorization: Bearer [token]