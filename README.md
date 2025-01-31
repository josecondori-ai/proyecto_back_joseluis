# Dashboard de Estadísticas de Pólizas

## Descripción
Este proyecto es un dashboard interactivo que permite la carga, visualización y gestión de pólizas de seguros. Proporciona estadísticas detalladas, gráficos interactivos y opciones de exportación en distintos formatos.

## Tecnologías Utilizadas

### Backend
- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework para la creación de APIs.
- **MySQL**: Base de datos relacional utilizada para almacenar las pólizas.
- **JWT (pendiente)**: Para la autenticación y seguridad de los endpoints.
- **PDFKit**: Generación de reportes en formato PDF.
- **ExcelJS**: Exportación de datos en formato Excel.
- **dotenv**: Gestión de variables de entorno.
- **bcryptjs**: Para el hash de contraseñas.
- **express-validator**: Validación de datos en las solicitudes API.

### Frontend
- **Next.js / React**: Framework de desarrollo frontend basado en React.
- **Tailwind CSS**: Framework de estilos CSS para una interfaz moderna y responsiva.
- **Chart.js**: Librería para visualización de datos con gráficos interactivos.
- **Axios**: Cliente HTTP para la comunicación con la API del backend.
- **React Router**: Manejo de rutas dentro de la aplicación.
- **Font Awesome**: Iconos utilizados en la interfaz.

## Estructura del Proyecto

### Backend
```
backend/
│── controllers/       # Controladores para manejar la lógica de negocio
│── models/            # Modelos de base de datos
│── routes/            # Definición de rutas API
│── config/            # Configuración de base de datos y variables de entorno
│── middlewares/       # Middleware de autenticación y validaciones
│── services/          # Servicios auxiliares como generación de reportes
│── index.js           # Archivo principal del servidor
│── package.json       # Dependencias del proyecto
│── .env               # Variables de entorno
```

### Frontend
```
frontend/
│── components/        # Componentes reutilizables
│── pages/             # Páginas principales del dashboard
│── styles/            # Estilos globales y específicos
│── services/          # Servicios de comunicación con el backend
│── hooks/             # Custom Hooks de React
│── public/            # Archivos estáticos como imágenes y logos
│── package.json       # Dependencias del frontend
│── tailwind.config.js # Configuración de Tailwind CSS
│── vite.config.js     # Configuración de Vite
```

## Base de Datos
La base de datos se gestiona en MySQL y consta de las siguientes tablas:

### Tabla `polizas`
| Campo          | Tipo       | Descripción |
|---------------|-----------|-------------|
| id            | INT (PK)  | Identificador único de la póliza |
| id_compania   | INT (FK)  | Referencia a la compañía de seguros |
| nombre_compania | VARCHAR | Nombre de la compañía |
| numero_poliza | INT       | Número único de la póliza |
| fecha_emision | DATE      | Fecha de emisión de la póliza |
| estado        | ENUM      | Estado de la póliza (activa, anulada) |
| prima         | DECIMAL   | Monto de la prima de la póliza |
| seccion       | VARCHAR   | Tipo de seguro (automotor, robo, etc.) |

### Tabla `companias`
| Campo       | Tipo       | Descripción |
|------------|-----------|-------------|
| id         | INT (PK)  | Identificador único de la compañía |
| nombre     | VARCHAR   | Nombre de la compañía |

## Funcionalidades

### Backend
- **Cargar pólizas**: Endpoint para agregar pólizas con validaciones.
- **Obtener estadísticas**: Cantidad de pólizas por compañía, estado y fechas.
- **Filtrar pólizas**: Búsqueda por compañía, estado, fechas y sección.
- **Exportación de datos**: Generación de reportes en PDF o Excel.
- **Autenticación (pendiente)**: Implementación de JWT para proteger endpoints.

### Frontend
- **Pantalla de autenticación (pendiente)**: Login con email y contraseña.
- **Dashboard interactivo**: Visualización de datos con gráficos dinámicos.
- **Filtros avanzados**: Búsqueda de pólizas por distintos criterios.
- **Carga de pólizas**: Formulario con validaciones.
- **Exportación de datos**: Descarga de estadísticas en PDF o Excel.

## Instalación y Configuración

### Backend
1. Clonar el repositorio.
2. Instalar dependencias con:
   ```sh
   npm install
   ```
3. Configurar las variables de entorno en un archivo `.env`.
4. Ejecutar el servidor con:
   ```sh
   npm start
   ```

### Frontend
1. Clonar el repositorio.
2. Instalar dependencias con:
   ```sh
   npm install
   ```
3. Iniciar la aplicación con:
   ```sh
   npm run dev
   ```

## Pendientes
- Implementación de autenticación con JWT en el backend y frontend.
- Validación de existencia de pólizas antes de su creación.
- Protección de rutas en el frontend.
- Mejoras en la interfaz de usuario (UI/UX).


