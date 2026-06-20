# DraAF - Sistema de Gestión de Citas y Pacientes

Sistema web moderno y profesional diseñado para clínicas y consultorios privados, permitiendo la autogestión de citas por parte de pacientes, la administración integral de historias clínicas por parte del personal médico, y envío automático de notificaciones vía WhatsApp.

## Características Principales

### Para Pacientes
- **Registro y Autenticación:** Flujo de registro seguro con recuperación de contraseña vía WhatsApp.
- **Reservas en Línea:** Calendario dinámico que respeta horas bloqueadas y disponibilidad real de la clínica.
- **Historial de Citas:** Visualización y cancelación de citas pasadas y futuras de manera autónoma.
- **Notificaciones WhatsApp:** Recepción de confirmaciones, recordatorios y cambios de estado de manera instantánea.

### Para Administradores / Doctores
- **Dashboard de Control:** Visualización general de citas del día y estadísticas.
- **Gestión de Pacientes:** Base de datos de pacientes con paginación, búsqueda en tiempo real, e historial clínico por paciente.
- **Gestión de Citas:** Confirmación, cancelación o marcado de "no asistencia" de las citas.
- **Historial Clínico (Notas):** Posibilidad de agregar notas internas privadas en el perfil de cada paciente y en cada cita.
- **Exportación:** Exportación a CSV de las listas de citas para reportes mensuales.
- **Configuraciones Avanzadas:** 
  - Manejo de horarios de la clínica.
  - Bloqueo de días por vacaciones o feriados.
  - Gestión de política de cancelación (horas mínimas permitidas).
  - Configuración de la API de WhatsApp (Evolution API / Baileys).

## Stack Tecnológico

El proyecto está dividido en un Backend robusto (Node.js/Express) y un Frontend dinámico (Next.js 15).

### Backend
- **Node.js & Express:** Servidor RESTful escrito en TypeScript.
- **MongoDB & Mongoose:** Base de datos NoSQL para almacenamiento estructurado y flexible de esquemas.
- **Zod:** Validación de esquemas y tipos de datos en la entrada de las rutas.
- **JSON Web Tokens (JWT):** Autenticación y autorización basada en roles (ADMIN vs PACIENTE).
- **Evolution API (WhatsApp):** Integración asíncrona (a través de un Worker local) para el envío de notificaciones.

### Frontend
- **Next.js 15:** Framework de React con App Router, optimizado para SEO, SSR y CSR.
- **Tailwind CSS:** Diseño moderno, responsivo y mantenible.
- **React Context:** Para el manejo global de Autenticación y Toast Notifications.
- **Axios:** Para comunicación estructurada y tipada con el Backend.

## Requisitos Previos

- Node.js (v20 o superior recomendado)
- MongoDB (local o MongoDB Atlas)
- Instancia de Evolution API / WAPI (opcional, para notificaciones WhatsApp)

## Instalación y Despliegue

### 1. Configuración del Backend

```bash
cd backend
npm install
# Crea un archivo .env basado en .env.example
npm run dev
```

### 2. Configuración del Frontend

```bash
cd frontend
npm install
# Crea un archivo .env.local basado en .env.example
npm run dev
```

## Arquitectura y Seguridad

- **Protección de Rutas:** Middleware de roles para evitar el acceso de pacientes a áreas administrativas.
- **Cifrado:** Las contraseñas se almacenan mediante hashing con *bcryptjs*.
- **CI/CD:** Pipelines de GitHub Actions automatizados para la validación de código y pruebas.

## Licencia

Este proyecto es de uso privativo.
