# Gym Management System 🏋️‍♂️

Sistema integral para la gestión de un gimnasio: usuarios, membresías, pagos, grilla de horarios, reserva de clases con cupo, control de accesos, rutinas personalizadas y estadísticas.

Las funcionalidades están inspiradas en el módulo de gimnasio de [Uno Bahía Club Interactivo](https://interactivo.unobahiaclub.com/) (solo el apartado gym: reservas de clases con cupos y estados, credencial de acceso, perfil, estadísticas, planificación de entrenamiento y compra de membresías). El diseño visual **no** es referencia, solo las funcionalidades.

## 🚀 Tecnologías

*   **Frontend:** React con TypeScript, Tailwind.
*   **Backend:** Node.js, Express, TypeScript, Sequelize, Zod.
*   **Base de Datos:** MySQL.

---

## 👥 Roles y Permisos (RBAC)

### 🛡️ Administrador
*   Gestión total de usuarios (CRUD) y asignación de roles (ej. promover un User a Profesor).
*   Gestión del catálogo de Actividades (Musculación, Funcional, Spinning, etc.).
*   Gestión de Planes de Membresía (creación, edición de precios, pase libre vs. limitado).
*   Control de Suscripciones: asignar planes a usuarios, renovar, cancelar.
*   Registro de Pagos (efectivo, transferencia, tarjeta) asociados a suscripciones.
*   Creación y gestión de la grilla de Horarios y Clases.
*   **Check-in y Accesos:** registro de entrada de usuarios en tiempo real, validando membresía vigente.
*   **Monitor de Cupos:** visualización de reservas activas y capacidad de las clases por día.
*   **Estadísticas globales:** socios activos, ingresos, asistencia diaria, ocupación de clases.

### 🏋️ Profesor
*   Visualización de los horarios/clases que tiene asignados.
*   Visualización de los inscriptos a sus clases (por fecha).
*   Creación, edición y envío de rutinas personalizadas a los usuarios.

### 🏃 Usuario
*   Registro y login. Recuperación de contraseña autónoma (token por email).
*   Visualización y edición de su perfil.
*   **Credencial digital:** identificación (DNI + nro. de socio) para el check-in en recepción.
*   Visualización del estado de su membresía actual (plan, vencimiento, pagos, clases restantes si el plan es limitado).
*   Visualización de la grilla de horarios del gimnasio (por día y por actividad).
*   **Reserva de Clases:** inscripción a clases con cupo limitado desde su panel, con cancelación de la reserva.
*   Acceso a las rutinas personalizadas enviadas por los profesores.
*   **Estadísticas personales:** historial de asistencia y de reservas.

---

## ⚙️ Funcionalidades por Módulo

### 1. Autenticación
*   Registro de usuario (rol `User` por defecto), login con JWT.
*   Recuperación de contraseña: solicitud de token (`password_reset_tokens`) y reseteo con token válido y no vencido.

### 2. Actividades
*   Catálogo administrado por el Admin (nombre, descripción, activa/inactiva).
*   Las clases de la grilla referencian una actividad (no texto libre), lo que permite filtrar horarios y estadísticas por actividad.

### 3. Planes y Suscripciones
*   `membership_plans` es el catálogo de "productos" del gimnasio; `user_subscriptions` es la compra de ese plan por un usuario.
*   **Pases Libres vs. Limitados:** el campo `class_limit` del plan determina si la suscripción descuenta clases (`classes_used`) con cada check-in o reserva asistida. `class_limit = NULL` significa pase libre.
*   Una suscripción tiene `start_date` / `end_date` (calculada con `duration_days` del plan) y `payment_status`.
*   Solo puede haber una suscripción vigente por usuario; renovar crea una nueva.

### 4. Pagos
*   Cada pago queda registrado en `payments`: monto, método (efectivo, transferencia, tarjeta, MercadoPago), fecha y quién lo registró.
*   Registrar un pago de una suscripción `PENDING` la pasa a `PAID`.
*   Historial de pagos consultable por el Admin (global o por usuario) y por el propio usuario.

### 5. Grilla de Horarios
*   Clases recurrentes semanales: actividad + día de la semana + hora inicio/fin + profesor + sala + capacidad.
*   `capacity = NULL` significa sin límite de cupo (ej. sala de musculación en horario libre).
*   Vista de grilla semanal pública para usuarios, filtrable por actividad y día.

### 6. Reserva de Clases (control de cupos)
*   Las reservas vinculan un horario recurrente (`schedule_id`) con una fecha específica (`reservation_date`), permitiendo controlar el aforo real por día y evitar sobreventas.
*   Reglas de negocio (validadas en el service):
    *   Requiere suscripción vigente y paga; si el plan es limitado, requiere clases disponibles.
    *   No se puede reservar si la clase está llena (estado **"Completa"**).
    *   Ventana de reserva configurable: la clase **"cierra"** X minutos antes del inicio y no se puede reservar una clase que **"ya empezó"** (estados calculados, como en el sitio de referencia).
    *   Un usuario no puede reservar dos veces la misma clase el mismo día (constraint único).
    *   Cancelación permitida hasta el cierre de la clase; cancelar devuelve el cupo.
*   Estados de la reserva: `RESERVED`, `CANCELLED`, `ATTENDED`, `NO_SHOW`.
*   El Admin/Profesor puede marcar asistencia de los reservados (pasa a `ATTENDED` y descuenta clase si el plan es limitado).

### 7. Check-in / Control de Acceso
*   El Admin registra la entrada del usuario (por DNI o nro. de socio de la credencial digital).
*   El check-in valida que exista una suscripción vigente y paga; si el plan es limitado, descuenta una clase.
*   Queda registrado quién hizo el check-in y una nota opcional.

### 8. Rutinas Personalizadas
*   El Profesor crea rutinas para un usuario específico (título + contenido).
*   `content` soporta texto o JSON estructurado (ejercicios, series, repeticiones) para escalabilidad futura.
*   El usuario ve sus rutinas; el profesor administra las que creó.

### 9. Estadísticas
*   **Usuario:** asistencias por mes, reservas realizadas/asistidas, clases restantes del período.
*   **Admin:** socios activos vs. vencidos, ingresos por período, check-ins del día, ocupación por clase/actividad.

---

## 🌐 Endpoints de la API

Prefijo general: `/api`. Los routers se auto-cargan desde `src/routes` (el nombre del archivo define el path, igual que en EcommerceTS).

### `/api/auth`
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/register` | Público | Registro de usuario (rol User) |
| POST | `/login` | Público | Login, devuelve JWT |
| POST | `/forgot-password` | Público | Genera token de recuperación |
| POST | `/reset-password` | Público | Resetea contraseña con token |
| GET | `/me` | Autenticado | Datos del usuario logueado |

### `/api/usuarios`
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Admin | Listado paginado (filtro por rol, búsqueda) |
| GET | `/:id` | Admin | Detalle de usuario |
| POST | `/` | Admin | Crear usuario |
| PATCH | `/:id` | Admin | Editar usuario (incluye cambio de rol) |
| DELETE | `/:id` | Admin | Baja lógica (`is_active = false`) |
| PATCH | `/perfil` | Autenticado | Editar el propio perfil |

### `/api/actividades`
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Público | Listado de actividades activas |
| POST | `/` | Admin | Crear actividad |
| PATCH | `/:id` | Admin | Editar actividad |
| DELETE | `/:id` | Admin | Baja lógica |

### `/api/planes`
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Público | Listado de planes activos |
| GET | `/:id` | Público | Detalle de plan |
| POST | `/` | Admin | Crear plan |
| PATCH | `/:id` | Admin | Editar plan |
| DELETE | `/:id` | Admin | Baja lógica |

### `/api/suscripciones`
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Admin | Listado (filtros: estado, vencimiento) |
| GET | `/mia` | Autenticado | Suscripción vigente del usuario (plan, vencimiento, clases restantes) |
| GET | `/usuario/:userId` | Admin | Historial de suscripciones de un usuario |
| POST | `/` | Admin | Asignar plan a usuario (calcula `end_date`) |
| POST | `/:id/renovar` | Admin | Renovar (crea nueva suscripción) |
| PATCH | `/:id/cancelar` | Admin | Cancelar suscripción |

### `/api/pagos`
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Admin | Historial de pagos (filtros por fecha/usuario) |
| GET | `/mios` | Autenticado | Pagos del usuario logueado |
| POST | `/` | Admin | Registrar pago de una suscripción (la marca `PAID`) |

### `/api/horarios`
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Público | Grilla semanal (filtros: actividad, día) |
| GET | `/profesor/:id` | Profesor/Admin | Clases asignadas a un profesor |
| POST | `/` | Admin | Crear clase en la grilla |
| PATCH | `/:id` | Admin | Editar clase |
| DELETE | `/:id` | Admin | Baja lógica |

### `/api/reservas`
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/dia` | Autenticado | Clases del día con estado calculado (cupos, Completa/Cerrada/Ya empezó) |
| GET | `/mias` | Autenticado | Reservas del usuario (próximas e historial) |
| POST | `/` | Autenticado | Reservar (valida suscripción, cupo y ventana) |
| PATCH | `/:id/cancelar` | Autenticado | Cancelar la propia reserva (devuelve cupo) |
| GET | `/clase/:scheduleId` | Profesor/Admin | Inscriptos de una clase en una fecha (`?fecha=`) — monitor de cupos |
| PATCH | `/:id/asistencia` | Profesor/Admin | Marcar `ATTENDED` / `NO_SHOW` |

### `/api/checkins`
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Admin | Check-ins (filtro por fecha, default hoy) |
| GET | `/mios` | Autenticado | Historial de asistencia propio |
| POST | `/` | Admin | Registrar entrada por DNI/nro. socio (valida membresía, descuenta clase si aplica) |

### `/api/rutinas`
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/mias` | Autenticado | Rutinas asignadas al usuario |
| GET | `/creadas` | Profesor | Rutinas creadas por el profesor |
| POST | `/` | Profesor | Crear rutina para un usuario |
| PATCH | `/:id` | Profesor | Editar rutina propia |
| DELETE | `/:id` | Profesor | Eliminar rutina propia |

### `/api/estadisticas`
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/mias` | Autenticado | Asistencias y reservas del usuario por período |
| GET | `/dashboard` | Admin | Socios activos, ingresos, check-ins de hoy, ocupación de clases |

---

## 🗄️ Arquitectura de Datos

La base separa el catálogo de servicios de las transacciones reales:

1.  `roles` / `users`: usuarios con rol, DNI (credencial) y baja lógica.
2.  `password_reset_tokens`: tokens de recuperación de contraseña con vencimiento.
3.  `activities`: catálogo de actividades del gimnasio.
4.  `membership_plans`: los "productos" que el gimnasio ofrece (`class_limit` define pase libre o limitado).
5.  `user_subscriptions`: la compra de un plan por un usuario; determina su acceso físico al local (`classes_used` para planes limitados).
6.  `payments`: registro real de cada cobro asociado a una suscripción.
7.  `schedules`: grilla semanal recurrente (actividad, profesor, sala, capacidad).
8.  `class_reservations`: reserva de un horario en una fecha concreta (aforo real por día).
9.  `check_ins`: control de acceso, con referencia al admin que lo registró.
10. `routines`: rutinas profesor → usuario, `content` texto o JSON.

### Lógica de negocio destacada
*   **Pases Libres vs. Limitados:** `class_limit` del plan determina si un `check_in` o una reserva `ATTENDED` incrementa `classes_used` de la suscripción.
*   **Aforo por día:** las reservas combinan `schedule_id` + `reservation_date` con constraint único por usuario, evitando sobreventa y doble reserva.
*   **Estados calculados de clase:** "Completa", "Cerrada" (dentro de la ventana de cierre) y "Ya empezó" no se persisten: se calculan al consultar la grilla del día.

---

## 🐳 Levantar el Proyecto

Con Docker (recomendado, igual que EcommerceTS):

```bash
docker compose up -d --build
```

*   **Backend:** http://localhost:3000/api (hot-reload con nodemon + tsx sobre `./backend/src`)
*   **Frontend:** http://localhost:5173 (Vite con hot-reload)
*   **MySQL:** puerto 3306; los scripts de `./db` se ejecutan solo en la primera creación del volumen (`docker compose down -v` para regenerar la DB desde cero).

Las variables se toman del `.env` de la raíz. Para correr el backend sin Docker: `npm run dev` en `./backend` (usa `backend/.env` con `DB_HOST=localhost`).

---

## 📁 Convenciones de Código

Mismas convenciones que **EcommerceTS** y **StixianBB**:

*   **Estructura backend:** `src/config`, `src/controllers`, `src/middlewares`, `src/models`, `src/routes`, `src/services`, `src/utils`, `src/validations`.
*   **Capas:** `*.controller.ts` (clase con métodos arrow, maneja `Request/Response` y códigos HTTP) → `*.service.ts` (clase con la lógica de negocio, lanza `Error` con mensajes en español, `mapToDto` privado) → `*.model.ts` (Sequelize `Model.init` con interfaces `Attributes`/`CreationAttributes`).
*   **Asociaciones:** centralizadas en `models/index.ts` (`setupAssociations`).
*   **Rutas:** un archivo por recurso en español (`usuarios.ts`, `planes.ts`...), instancian service + controller, exportan `default` y `{ router }`; `routes/index.ts` las auto-carga y monta en `/api/<nombre-archivo>`.
*   **Validación:** esquemas Zod en `src/validations` + middleware `validateSchema`; tipos inferidos con `z.infer`.
*   **Auth:** middlewares `authenticateToken`, `isAdmin` (y aquí también `isProfessor`); JWT en `utils/jwt.handle.ts`, hash con bcrypt en `utils/password.handle.ts`.
*   **Respuestas:** `{ success: true, data / message }` en éxito; `{ success: false, message }` en error, con mensajes en español.
*   **Baja lógica** en catálogos (flag activo) en lugar de DELETE físico.
