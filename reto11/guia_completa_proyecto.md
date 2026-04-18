# 🚀 Guía Completa — Backend Node.js + Docker + MySQL (Prisma)

> Guía estructural para entender y replicar este proyecto aplicándolo a cualquier otro tema.

---

## 📋 Tabla de Contenidos

1. [Tecnologías Utilizadas](#1--tecnologías-utilizadas)
2. [Estructura de Carpetas](#2--estructura-de-carpetas)
3. [Paso a Paso: Crear el Proyecto desde Cero](#3--paso-a-paso-crear-el-proyecto-desde-cero)
4. [Configuración de Docker](#4--configuración-de-docker)
5. [Variables de Entorno (.env)](#5--variables-de-entorno-env)
6. [Prisma — ORM y Base de Datos](#6--prisma--orm-y-base-de-datos)
7. [Arquitectura por Capas — Explicación Completa](#7--arquitectura-por-capas--explicación-completa)
8. [Middlewares](#8--middlewares)
9. [Flujo Completo de una Petición](#9--flujo-completo-de-una-petición)
10. [Cómo Adaptar este Proyecto a Otro Tema](#10--cómo-adaptar-este-proyecto-a-otro-tema)

---

## 1. 🛠 Tecnologías Utilizadas

| Tecnología | ¿Para qué sirve? |
|---|---|
| **Node.js** | Runtime de JavaScript en el servidor |
| **Express 5** | Framework web para crear la API REST |
| **Prisma 5.22.0** | ORM para interactuar con la base de datos sin escribir SQL crudo (versión fijada por compatibilidad) |
| **MySQL 8.0** | Base de datos relacional (corre dentro de Docker) |
| **Docker** | Contenedores para levantar MySQL, Adminer y el backend de forma aislada |
| **Docker Compose** | Orquestador que levanta todos los servicios con un solo comando |
| **bcrypt** | Hasheo de contraseñas (seguridad) |
| **jsonwebtoken (JWT)** | Generación y verificación de tokens para autenticación |
| **dotenv** | Carga variables de entorno desde archivos `.env` |
| **nodemon** | Reinicia el servidor automáticamente al detectar cambios en el código |
| **cors** | Permite peticiones desde otros dominios (Cross-Origin) |
| **axios** | Cliente HTTP para hacer peticiones de prueba desde Node |
| **Adminer** | Interfaz web para administrar la base de datos MySQL |

---

## 2. 📁 Estructura de Carpetas

```
backend-node-docker/
├── prisma/
│   ├── schema.prisma          ← Define los modelos/tablas de la BD
│   └── migrations/            ← Historial de cambios en la BD
├── src/
│   ├── index.js               ← PUNTO DE ENTRADA — Arranca Express
│   ├── routes/                ← CAPA 1: Define las rutas/endpoints
│   │   ├── authRoutes.js
│   │   └── tareaRoutes.js
│   ├── controllers/           ← CAPA 2: Maneja req/res HTTP
│   │   ├── auntController.js
│   │   └── tareaController.js
│   ├── services/              ← CAPA 3: Lógica de negocio
│   │   ├── authServices.js
│   │   └── tareaService.js
│   ├── repositories/          ← CAPA 4: Acceso directo a la BD (Prisma)
│   │   ├── userRepository.js
│   │   ├── tareaRepository.js
│   │   └── tockenBlacklisRepository.js
│   ├── middleware/            ← Filtros que se ejecutan antes del controller
│   │   ├── authMiddelware.js
│   │   └── rolMiddelware.js
│   └── client/                ← Scripts de prueba
│       └── testApi.js
├── .env                       ← Variables de entorno (desarrollo local)
├── .env.test                  ← Variables para ambiente de testing
├── .env.prod                  ← Variables para producción
├── .gitignore                 ← Archivos ignorados por Git
├── Dockerfile                 ← Instrucciones para construir imagen Docker
├── docker-compose.yml         ← Orquestación de servicios Docker
├── package.json               ← Dependencias y scripts
├── prisma.config.ts           ← Configuración de Prisma
└── package-lock.json
```

---

## 3. 🏗 Paso a Paso: Crear el Proyecto desde Cero

### Paso 3.1 — Crear la carpeta e inicializar Node.js

```bash
mkdir mi-proyecto-backend
cd mi-proyecto-backend
npm init -y
```

> [!NOTE]
> `npm init -y` crea el `package.json` con valores predeterminados. Este archivo es el "DNI" de tu proyecto Node.js.

### Paso 3.2 — Configurar CommonJS

En el `package.json`, asegúrate de tener:

```json
"type": "commonjs"
```

Esto permite usar `require()` y `module.exports` en lugar de `import/export`.

### Paso 3.3 — Instalar dependencias del proyecto

```bash
# Framework web
npm install express

# ORM para base de datos (versión 5.22.0 específica — ver nota abajo)
npm install @prisma/client@5.22.0

# Autenticación
npm install bcrypt jsonwebtoken

# Variables de entorno
npm install dotenv

# CORS (permitir peticiones de otros dominios)
npm install cors

# Cliente HTTP para pruebas
npm install axios

# Herramienta de desarrollo (reinicio automático)
npm install nodemon

# Prisma CLI (misma versión que @prisma/client)
npm install prisma@5.22.0
```

**O todo junto en un solo comando:**

```bash
npm install express @prisma/client@5.22.0 prisma@5.22.0 bcrypt jsonwebtoken dotenv cors axios nodemon
```

> [!WARNING]
> **¿Por qué Prisma 5.22.0 y no la última versión?**
>
> En este proyecto se usó inicialmente la versión más reciente de Prisma (v6+/v7+), que trajo problemas de compatibilidad:
> - Prisma 6+ cambió la forma de configurar el cliente y requiere un `prisma.config.ts`.
> - Se intentó usar `@prisma/adapter-mariadb` + el driver `mariadb` para conectar con MySQL, pero esto generó errores complejos.
> - **La solución fue bajar a Prisma 5.22.0**, que usa el driver nativo integrado y se conecta directamente a MySQL sin necesidad de adaptadores externos.
>
> **Resultado:** Los paquetes `@prisma/adapter-mariadb` y `mariadb` quedaron en el `package.json` como residuos del intento anterior, pero **NO se usan en ningún archivo del código**. El proyecto funciona directamente con `@prisma/client` v5.22.0 conectando a MySQL vía `DATABASE_URL`.
>
> Si quieres un proyecto limpio, **no los instales**. Solo necesitas `@prisma/client@5.22.0` y `prisma@5.22.0`.

### Paso 3.4 — Configurar el script de inicio

En `package.json`, dentro de `"scripts"`:

```json
"scripts": {
    "start": "nodemon src/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
}
```

> [!TIP]
> `nodemon` vigila los archivos y reinicia el servidor cuando guardas cambios. Perfecto para desarrollo.

### Paso 3.5 — Crear el .gitignore

```
node_modules
.env
/src/generated/prisma
```

---

## 4. 🐳 Configuración de Docker

### 4.1 — ¿Qué es Docker y para qué lo usamos aquí?

Docker nos permite levantar **MySQL** y **Adminer** sin tener que instalarlos en tu computadora. Todo corre dentro de "contenedores" aislados.

### 4.2 — Dockerfile (construir la imagen del backend)

```dockerfile
FROM node:20-alpine        # Imagen base: Node.js 20 versión ligera

WORKDIR /usr/src/app       # Carpeta de trabajo dentro del contenedor

COPY package*.json .       # Copiar package.json y package-lock.json

RUN npm install            # Instalar dependencias

COPY . .                   # Copiar todo el código fuente

EXPOSE 3000                # Exponer el puerto 3000

CMD ["npm", "start"]       # Comando que se ejecuta al iniciar el contenedor
```

> [!NOTE]
> **¿Por qué se copia el `package.json` primero y luego el resto?** Porque Docker usa "cache por capas". Si el `package.json` no cambió, Docker reutiliza las dependencias ya instaladas y no ejecuta `npm install` de nuevo — esto hace que el build sea mucho más rápido.

### 4.3 — docker-compose.yml (orquestar todos los servicios)

```yaml
services:
  # ── Servicio 1: Base de datos MySQL ──
  mysql:
    image: mysql:8.0                      # Imagen oficial de MySQL 8
    restart: always                       # Reiniciar si se cae
    environment:                          # Variables de entorno del contenedor
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD} # Contraseña del root (viene del .env)
      MYSQL_DATABASE: ${DB_NAME}          # Nombre de la BD a crear automáticamente
      MYSQL_USER: ${DB_USER}              # Usuario adicional
      MYSQL_PASSWORD: ${DB_PASSWORD}      # Contraseña del usuario
    ports:
      - "3306:3306"                       # Puerto local:puerto contenedor
    volumes:
      - mysql_data:/var/lib/mysql         # Persistir datos aunque el contenedor se borre

  # ── Servicio 2: Adminer (interfaz web para DB) ──
  adminer:
    image: adminer                        # Imagen oficial de Adminer
    restart: always
    ports:
      - "8080:8080"                       # Accesible en http://localhost:8080
    depends_on:
      - mysql                             # Se levanta después de MySQL

  # ── Servicio 3: Backend Node.js ──
  backend:
    build: .                              # Construir usando el Dockerfile local
    ports:
      - "3000:3000"
    depends_on:
      - mysql                             # Se levanta después de MySQL
    env_file:
      - .env                              # Inyectar variables de entorno
    volumes:
      - ./:/usr/src/app                   # Montar código local (hot-reload)

# ── Volúmenes persistentes ──
volumes:
  mysql_data:                             # Los datos de MySQL sobreviven reinicios
```

### 4.4 — Comandos Docker esenciales

```bash
# Levantar todos los servicios (MySQL + Adminer + Backend)
docker compose up

# Levantar en segundo plano
docker compose up -d

# Detener todos los servicios
docker compose down

# Reconstruir la imagen del backend (después de cambios en Dockerfile)
docker compose up --build

# Ver logs de un servicio específico
docker compose logs backend
```

> [!IMPORTANT]
> **Para desarrollo local**, puedes levantar solo MySQL y Adminer con Docker, y correr el backend directamente con `npm start`. En ese caso, en tu `.env` el `DB_HOST` será `127.0.0.1`. Si todo corre en Docker, el `DB_HOST` será `mysql` (nombre del servicio en docker-compose).

---

## 5. 🔐 Variables de Entorno (.env)

Las variables de entorno guardan datos sensibles o de configuración **fuera del código**. Se cargan con `dotenv`.

### .env (Desarrollo local — backend fuera de Docker)

```env
NODE_ENV=development
PORT=3000
DB_HOST=127.0.0.1          # ← localhost porque el backend corre fuera de Docker
DB_USER=root
DB_PASSWORD=root
DB_NAME=tareas_db
JWT_SECRET=clave_ultrasecreta

DATABASE_URL="mysql://root:root@127.0.0.1:3306/tareas_db"

CORS_ORIGIN=http://localhost:3000
```

### .env.test (Testing — todo en Docker)

```env
NODE_ENV=test
PORT=3000
DB_HOST=mysql               # ← "mysql" es el nombre del servicio en docker-compose
DB_USER=tarea_user
DB_PASSWORD=root
DB_NAME=tareas_db
JWT_SECRET=clave_test_secreta
```

### .env.prod (Producción)

```env
NODE_ENV=production
PORT=3000
DB_HOST=mysql
DB_USER=tarea_user
DB_PASSWORD=root
DB_NAME=tareas_db
JWT_SECRET=clave_ultrasecreta_prod
```

> [!WARNING]
> El archivo `.env` **nunca debe subirse a Git**. Por eso está en `.gitignore`. Contiene contraseñas y claves secretas.

### ¿Cómo se cargan?

En la **primera línea** de `src/index.js`:

```javascript
require("dotenv").config();
```

Esto lee el archivo `.env` y pone las variables disponibles en `process.env.NOMBRE_VARIABLE`.

### La DATABASE_URL

La `DATABASE_URL` es una cadena de conexión que Prisma usa para conectarse a la base de datos. Su formato es:

```
mysql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_BD
```

Ejemplo: `mysql://root:root@127.0.0.1:3306/tareas_db`

---

## 6. 💾 Prisma — ORM y Base de Datos

### 6.1 — ¿Qué es Prisma?

Prisma es un **ORM** (Object-Relational Mapping). En lugar de escribir SQL crudo como:

```sql
SELECT * FROM tareas WHERE usuarioId = 1;
```

Con Prisma escribes:

```javascript
const tareas = await prisma.tarea.findMany({ where: { usuarioId: 1 } });
```

### 6.2 — Inicializar Prisma en el proyecto

```bash
npx prisma init
```

Esto crea:
- `prisma/schema.prisma` — Donde defines tus modelos (tablas)
- Un archivo `.env` con la variable `DATABASE_URL` (si no existía)

### 6.3 — El Schema (prisma/schema.prisma)

Es el **mapa de tu base de datos**. Define las tablas y sus relaciones:

```prisma
// ── Conexión a la base de datos ──
datasource db {
  provider = "mysql"                    // Tipo de BD: MySQL
  url      = env("DATABASE_URL")        // URL de conexión desde .env
}

// ── Generador del cliente Prisma ──
generator client {
  provider = "prisma-client-js"         // Genera código JavaScript
}

// ── MODELO: Usuario ──
model Usuario {
  id          Int      @id @default(autoincrement())  // PK autoincremental
  email       String   @unique                         // Email único
  password    String                                   // Contraseña hasheada
  rol         String   @default("usuario")             // Rol: "usuario" o "admin"
  tareas      Tarea[]                                  // Relación 1:N con Tarea
}

// ── MODELO: Tarea ──
model Tarea {
  id          Int      @id @default(autoincrement())
  titulo      String
  descripcion String?                                  // El ? = campo opcional
  completada  Boolean  @default(false)
  usuarioId   Int                                      // FK al usuario
  usuario     Usuario  @relation(fields: [usuarioId], references: [id])  // Relación
}

// ── MODELO: TokenRevocado (Blacklist de tokens) ──
model TokenRevocado {
  id          Int      @id @default(autoincrement())
  token       String   @unique @db.VarChar(512)        // Token JWT revocado
  createdAt   DateTime @default(now())
}
```

> [!NOTE]
> **Relación 1:N (uno a muchos):** Un `Usuario` puede tener muchas `Tarea`s. Esto se define con `Tarea[]` en Usuario y `@relation` en Tarea.

### 6.4 — Comandos de Prisma

```bash
# Crear una migración (generar SQL a partir del schema)
npx prisma migrate dev --name nombre_de_la_migracion

# Generar el cliente Prisma (después de cambiar el schema)
npx prisma generate

# Ver la BD en una interfaz web (Prisma Studio)
npx prisma studio

# Resetear la BD completa
npx prisma migrate reset
```

> [!IMPORTANT]
> Cada vez que modificas `schema.prisma`, debes ejecutar `npx prisma migrate dev` para aplicar los cambios a la BD y `npx prisma generate` para actualizar el cliente.

### 6.5 — prisma.config.ts

Este archivo configura de dónde Prisma toma la URL de conexión:

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

---

## 7. 🏛 Arquitectura por Capas — Explicación Completa

El proyecto usa una **arquitectura por capas** (Layered Architecture). Cada capa tiene una **responsabilidad única** y solo se comunica con la capa adyacente.

### Diagrama Visual

```mermaid
graph TD
    A["🌐 Cliente<br/>(Postman, Frontend, testApi.js)"] -->|"HTTP Request"| B
    B["📍 Routes<br/>(authRoutes.js, tareaRoutes.js)"] -->|"Llama función del"| C
    C["🎮 Controllers<br/>(auntController.js, tareaController.js)"] -->|"Llama función del"| D
    D["⚙️ Services<br/>(authServices.js, tareaService.js)"] -->|"Llama función del"| E
    E["💾 Repositories<br/>(userRepository.js, tareaRepository.js)"] -->|"Consulta"| F
    F["🗄️ Base de Datos<br/>(MySQL via Prisma)"]
    
    G["🛡️ Middleware<br/>(authMiddleware, rolMiddleware)"] -.->|"Se ejecuta ENTRE<br/>Routes y Controllers"| C
    
    style A fill:#6366f1,stroke:#4f46e5,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style C fill:#10b981,stroke:#059669,color:#fff
    style D fill:#3b82f6,stroke:#2563eb,color:#fff
    style E fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style F fill:#ef4444,stroke:#dc2626,color:#fff
    style G fill:#f97316,stroke:#ea580c,color:#fff
```

---

### CAPA 1: Routes (Rutas) — `src/routes/`

**¿Qué es?** Define los **endpoints** (URLs) de tu API y los conecta con los controllers.

**Responsabilidad:** Solo mapear URLs con funciones. No tiene lógica.

#### authRoutes.js

```javascript
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auntController");

// POST /api/auth/register → Registrar un usuario
router.post("/register", authController.registrarUsuario);

// POST /api/auth/login → Iniciar sesión
router.post("/login", authController.loginUsuario);

// POST /api/auth/logout → Cerrar sesión
router.post("/logout", authController.logoutUsuario);

module.exports = router;
```

#### tareaRoutes.js

```javascript
const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const { verificarToken } = require("../middleware/authMiddelware");
const { autorizarRoles } = require("../middleware/rolMiddelware");

// GET /api/tareas — Requiere estar autenticado
router.get("/tareas", verificarToken, tareaController.getTareas);

// DELETE /api/tareas/:id — Solo admins
router.delete("/tareas/:id", verificarToken, autorizarRoles("admin"), tareaController.eliminarTarea);

// POST /api/tareas — admins y usuarios
router.post("/tareas", verificarToken, autorizarRoles("admin", "usuario"), tareaController.crearTarea);

module.exports = router;
```

> [!TIP]
> Observa cómo el middleware se "encadena" en la ruta: `verificarToken` → `autorizarRoles(...)` → `controller`. Cada middleware debe llamar a `next()` para pasar al siguiente.

---

### CAPA 2: Controllers (Controladores) — `src/controllers/`

**¿Qué es?** Recibe la petición HTTP, extrae los datos del `req` (body, params, headers), llama al service, y devuelve la respuesta HTTP `res`.

**Responsabilidad:** Manejar el **req** y **res**. No tiene lógica de negocio, no accede a la BD directamente.

#### auntController.js (Auth)

```javascript
const authServices = require("../services/authServices");
const tokenBlacklistRepository = require("../repositories/tockenBlacklisRepository");

// ── Registrar usuario ──
async function registrarUsuario(req, res) {
    try {
        // req.body contiene { email, password, rol }
        const usuario = await authServices.registrarUsuario(req.body);
        res.status(201).json({ message: "Usuario registrado exitosamente", data: usuario });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// ── Login ──
async function loginUsuario(req, res) {
    try {
        // req.body contiene { email, password }
        const token = await authServices.loginUsuario(req.body);
        res.status(200).json({ message: "Usuario logueado exitosamente", data: token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// ── Logout ──
async function logoutUsuario(req, res) {
    const authHeader = req.headers.authorization;         // "Bearer eyJhb..."
    if (!authHeader) return res.status(401).json({ message: "Token no proporcionado" });
    const token = authHeader.split(" ")[1];                // Extraer solo el token
    if (!token) return res.status(401).json({ message: "No se proporcionó el token" });
    try {
        await tokenBlacklistRepository.agregarToken(token); // Revocar el token
        res.status(200).json({ message: "Usuario deslogueado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { registrarUsuario, loginUsuario, logoutUsuario };
```

#### tareaController.js

```javascript
const tareaService = require("../services/tareaService");

// ── Obtener todas las tareas ──
async function getTareas(req, res) {
    try {
        const tareas = await tareaService.getTareas();
        res.status(200).json({ message: "Tareas obtenidas correctamente", data: tareas });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las tareas" });
    }
}

// ── Eliminar tarea (solo admin) ──
async function eliminarTarea(req, res) {
    try {
        const id = parseInt(req.params.id);         // ID de la URL: /api/tareas/5
        if (isNaN(id)) {
            return res.status(400).json({ message: "El ID no es un número válido" });
        }
        const tarea = await tareaService.eliminarTarea(id, req.user.id);
        //                                              ↑ req.user viene del middleware JWT
        res.status(200).json({ message: "Tarea eliminada correctamente", data: tarea });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la tarea" });
    }
}

// ── Crear tarea ──
async function crearTarea(req, res) {
    try {
        const tarea = await tareaService.crearTarea(req.body, req.user.id);
        //                                         ↑ {titulo, descripcion}  ↑ ID del usuario logueado
        res.status(201).json({ message: "Tarea creada correctamente", data: tarea });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la tarea" });
    }
}

module.exports = { getTareas, eliminarTarea, crearTarea };
```

---

### CAPA 3: Services (Servicios) — `src/services/`

**¿Qué es?** Contiene la **lógica de negocio** — validaciones, transformaciones, reglas del negocio.

**Responsabilidad:** Procesar datos, aplicar reglas de negocio, y delegar el acceso a datos al repository.

#### authServices.js

```javascript
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const secret_key = process.env.JWT_SECRET;
const saltRounds = 10;

// ── Registrar usuario ──
async function registrarUsuario(data) {
    // REGLA DE NEGOCIO: No permitir emails duplicados
    const userExiste = await userRepository.obtenerPorEmail(data.email);
    if (userExiste) throw new Error("Usuario ya existe");

    // LÓGICA: Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Delegar el guardado al repository
    const user = await userRepository.crearUsuario({
        ...data,
        password: hashedPassword,
        rol: data.rol
    });
    return user;
}

// ── Login ──
async function loginUsuario({ email, password }) {
    const usuario = await userRepository.obtenerPorEmail(email);
    if (!usuario) throw new Error("Usuario no encontrado");

    // LÓGICA: Comparar contraseña enviada con la hasheada de la BD
    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecto) throw new Error("Contraseña incorrecta");

    // LÓGICA: Generar un JWT con los datos del usuario
    const payload = { id: usuario.id, email: usuario.email, rol: usuario.rol };
    const token = jwt.sign(payload, secret_key, { expiresIn: "1h" });

    return { usuario, token };
}

module.exports = { registrarUsuario, loginUsuario };
```

#### tareaService.js

```javascript
const tareaRepository = require("../repositories/tareaRepository");

// ── No hay lógica de negocio compleja, solo delega al repository ──
async function getTareas() {
    return await tareaRepository.getTareas();
}

async function eliminarTarea(id, usuarioId) {
    return await tareaRepository.eliminarTarea(id, usuarioId);
}

async function crearTarea(data, usuarioId) {
    return await tareaRepository.crearTarea(data, usuarioId);
}

module.exports = { getTareas, eliminarTarea, crearTarea };
```

> [!NOTE]
> **¿Por qué existe `tareaService.js` si solo pasa datos?** Porque en un proyecto real es aquí donde agregarías validaciones como: *"un usuario free solo puede tener 5 tareas"*, o *"solo puedes eliminar tus propias tareas"*. Mantener la capa aunque esté vacía prepara la arquitectura para crecer.

---

### CAPA 4: Repositories (Repositorios) — `src/repositories/`

**¿Qué es?** Es la **única capa que toca la base de datos**. Usa Prisma Client para hacer las operaciones CRUD.

**Responsabilidad:** Ejecutar consultas a la BD. No tiene lógica de negocio.

#### userRepository.js

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Crear un usuario en la BD
async function crearUsuario(data) {
    return await prisma.usuario.create({ data });
}

// Buscar un usuario por email
async function obtenerPorEmail(email) {
    return await prisma.usuario.findUnique({ where: { email } });
}

module.exports = { crearUsuario, obtenerPorEmail };
```

#### tareaRepository.js

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener todas las tareas
async function getTareas() {
    return await prisma.tarea.findMany();
}

// Eliminar tarea por ID
async function eliminarTarea(id, usuarioId) {
    return await prisma.tarea.delete({ where: { id, usuarioId } });
}

// Crear una tarea y asociarla a un usuario
async function crearTarea(data, usuarioId) {
    return await prisma.tarea.create({ data: { ...data, usuarioId } });
}

module.exports = { getTareas, eliminarTarea, crearTarea };
```

#### tockenBlacklisRepository.js

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Guardar un token revocado
async function agregarToken(token) {
    return await prisma.tokenRevocado.create({ data: { token } });
}

// Verificar si un token está revocado
async function estaRevocado(token) {
    const registro = await prisma.tokenRevocado.findUnique({ where: { token } });
    return !!registro;  // !! convierte a booleano: null → false, objeto → true
}

module.exports = { agregarToken, estaRevocado };
```

---

## 8. 🛡️ Middlewares

Los middlewares son **funciones que se ejecutan ENTRE la recepción de la petición y el controller**. Actúan como "filtros" o "vigilantes".

### authMiddleware.js — Verificar Token JWT

```javascript
const jwt = require("jsonwebtoken");
const tokenBlacklistRepository = require("../repositories/tockenBlacklisRepository");
const secret_key = process.env.JWT_SECRET;

async function verificarToken(req, res, next) {
    // 1. Extraer el header "Authorization: Bearer eyJhb..."
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token no proporcionado" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No se proporcionó el token" });

    // 2. Verificar que el token no esté en la blacklist (logout)
    const revocado = await tokenBlacklistRepository.estaRevocado(token);
    if (revocado) return res.status(401).json({ message: "Token revocado" });

    // 3. Verificar y decodificar el token
    try {
        const decoded = jwt.verify(token, secret_key);
        req.user = decoded;  // ← Inyecta { id, email, rol } en req.user
        next();              // ← Continúa al siguiente middleware o controller
    } catch (error) {
        res.status(403).json({ message: "Token inválido" });
    }
}

module.exports = { verificarToken };
```

### rolMiddleware.js — Autorización por Roles

```javascript
function autorizarRoles(...rolesPermitidos) {
    // Retorna un middleware (función que recibe req, res, next)
    return (req, res, next) => {
        const usuario = req.user;  // ← Viene del middleware verificarToken
        if (!usuario) return res.status(401).json({ message: "Usuario no autenticado" });
        if (!rolesPermitidos.includes(usuario.rol)) {
            return res.status(403).json({ message: "Rol no autorizado" });
        }
        next();
    };
}

module.exports = { autorizarRoles };
```

> [!IMPORTANT]
> **Orden de ejecución en una ruta protegida:**
> ```
> verificarToken → autorizarRoles("admin") → controller
> ```
> Si `verificarToken` falla, la petición se detiene ahí y nunca llega al controller.

---

## 9. 🔄 Flujo Completo de una Petición

### Ejemplo: `POST /api/tareas` (Crear una tarea)

```mermaid
sequenceDiagram
    participant C as 🌐 Cliente
    participant I as 📍 index.js
    participant R as 🗺️ tareaRoutes
    participant M1 as 🛡️ verificarToken
    participant M2 as 🔒 autorizarRoles
    participant CT as 🎮 tareaController
    participant S as ⚙️ tareaService
    participant RP as 💾 tareaRepository
    participant DB as 🗄️ MySQL

    C->>I: POST /api/tareas {titulo, descripcion} + Bearer Token
    I->>R: Enruta a tareaRoutes
    R->>M1: Ejecuta verificarToken()
    M1->>M1: Extrae y verifica JWT
    M1->>M1: Verifica que no esté revocado
    M1->>R: next() → inyecta req.user
    R->>M2: Ejecuta autorizarRoles("admin","usuario")
    M2->>M2: Verifica rol del usuario
    M2->>R: next()
    R->>CT: crearTarea(req, res)
    CT->>S: crearTarea(req.body, req.user.id)
    S->>RP: crearTarea(data, usuarioId)
    RP->>DB: prisma.tarea.create(...)
    DB-->>RP: Tarea creada
    RP-->>S: Retorna tarea
    S-->>CT: Retorna tarea
    CT-->>C: res.status(201).json({message, data})
```

### Ejemplo: `POST /api/auth/login` (Login)

```mermaid
sequenceDiagram
    participant C as 🌐 Cliente
    participant R as 🗺️ authRoutes
    participant CT as 🎮 authController
    participant S as ⚙️ authServices
    participant RP as 💾 userRepository
    participant DB as 🗄️ MySQL

    C->>R: POST /api/auth/login {email, password}
    R->>CT: loginUsuario(req, res)
    CT->>S: loginUsuario({email, password})
    S->>RP: obtenerPorEmail(email)
    RP->>DB: prisma.usuario.findUnique(...)
    DB-->>RP: Usuario encontrado
    RP-->>S: Retorna usuario
    S->>S: bcrypt.compare(password, hash)
    S->>S: jwt.sign(payload, secret)
    S-->>CT: Retorna {usuario, token}
    CT-->>C: res.status(200).json({message, data})
```

---

## 10. 🎯 Cómo Adaptar este Proyecto a Otro Tema

Supongamos que quieres hacer un **sistema de recetas de cocina** en vez de tareas. Aquí va cómo:

### Paso 1: Clonar la estructura

```
mi-proyecto-recetas/
├── prisma/
│   └── schema.prisma        ← Cambia los modelos
├── src/
│   ├── index.js              ← Cambia los nombres de ruta
│   ├── routes/
│   │   ├── authRoutes.js     ← Se reutiliza igual (auth es genérico)
│   │   └── recetaRoutes.js   ← NUEVO: reemplaza tareaRoutes
│   ├── controllers/
│   │   ├── authController.js ← Se reutiliza igual
│   │   └── recetaController.js  ← NUEVO
│   ├── services/
│   │   ├── authServices.js   ← Se reutiliza igual
│   │   └── recetaService.js  ← NUEVO
│   ├── repositories/
│   │   ├── userRepository.js ← Se reutiliza igual
│   │   └── recetaRepository.js  ← NUEVO
│   └── middleware/           ← Se reutiliza todo igual
├── .env, Dockerfile, docker-compose.yml  ← Solo cambia DB_NAME
```

### Paso 2: Cambiar el Schema de Prisma

```prisma
model Receta {
  id           Int      @id @default(autoincrement())
  titulo       String
  ingredientes String   @db.Text
  instrucciones String  @db.Text
  tiempo       Int                     // Tiempo en minutos
  dificultad   String   @default("facil")
  usuarioId    Int
  usuario      Usuario  @relation(fields: [usuarioId], references: [id])
}
```

### Paso 3: Crear las 4 capas para "Receta"

La receta es simple — remplazar "tarea" por "receta" en cada capa:

| Capa | Archivo original | Archivo nuevo |
|---|---|---|
| Route | `tareaRoutes.js` | `recetaRoutes.js` |
| Controller | `tareaController.js` | `recetaController.js` |
| Service | `tareaService.js` | `recetaService.js` |
| Repository | `tareaRepository.js` | `recetaRepository.js` |

### Paso 4: Registrar las nuevas rutas en index.js

```javascript
const recetaRoutes = require("./routes/recetaRoutes");
app.use("/api", recetaRoutes);
```

### Paso 5: Ejecutar migración

```bash
npx prisma migrate dev --name agregar_modelo_receta
```

### Checklist para cualquier nuevo proyecto

- [ ] `npm init -y`
- [ ] `npm install express @prisma/client @prisma/adapter-mariadb mariadb bcrypt jsonwebtoken dotenv cors nodemon prisma`
- [ ] Crear `.env` con DATABASE_URL, JWT_SECRET, PORT, etc.
- [ ] `npx prisma init`
- [ ] Definir modelos en `prisma/schema.prisma`
- [ ] `npx prisma migrate dev --name init`
- [ ] Crear `docker-compose.yml` con MySQL + Adminer
- [ ] `docker compose up -d`
- [ ] Crear estructura de carpetas: `routes/`, `controllers/`, `services/`, `repositories/`, `middleware/`
- [ ] Crear `src/index.js` con la configuración de Express
- [ ] Implementar auth (register, login, logout + JWT + bcrypt)
- [ ] Implementar middleware de verificación de token
- [ ] Implementar middleware de roles
- [ ] Implementar las rutas de tu entidad principal
- [ ] Probar con Postman o Thunder Client

---

> [!TIP]
> **Regla de oro de la arquitectura por capas:**
> - **Routes** → Solo define URLs y encadena middlewares
> - **Controllers** → Solo toca `req` y `res`
> - **Services** → Solo lógica de negocio (validaciones, reglas, transformaciones)
> - **Repositories** → Solo habla con la base de datos
> - **Cada capa solo llama a la capa inmediatamente inferior. Nunca al revés.**
