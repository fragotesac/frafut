# ⚽ Sistema de Organización de Campeonatos de Fútbol

Sistema completo para la gestión y organización de campeonatos de fútbol, con seguimiento en tiempo real de partidos, estadísticas de jugadores, tabla de posiciones y más.

## 📋 Características Principales

### Funcionalidades del MVP

- ✅ **Autenticación completa**: Registro, login y gestión de usuarios con JWT
- ✅ **Gestión de campeonatos**: Crear, editar y administrar torneos
- ✅ **Gestión de equipos**: Registrar equipos con su información
- ✅ **Gestión de jugadores**: Administrar plantillas de jugadores por equipo
- ✅ **Programación de partidos**: Crear y gestionar calendario de encuentros
- ✅ **Minuto a minuto en tiempo real**: Seguimiento de partidos con Socket.IO
- ✅ **Eventos de partido**: Goles, tarjetas amarillas, tarjetas rojas, cambios, etc.
- ✅ **Tabla de posiciones automática**: Se actualiza con los resultados
- ✅ **Tabla de goleadores**: Ranking de máximos anotadores
- ✅ **Estadísticas de tarjetas**: Control de amonestaciones

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

#### Backend
- **Node.js** (LTS v20+) con **Express**
- **PostgreSQL** como base de datos relacional
- **Prisma ORM** para manejo de datos y migraciones
- **JWT** para autenticación y autorización
- **Socket.IO** para comunicación en tiempo real
- **TypeScript** para tipado estático

#### Frontend (App Móvil)
- **React Native** con **Expo**
- **React Navigation** para navegación
- **React Query (@tanstack/react-query)** para gestión de estado del servidor
- **Context API** para estado local (autenticación)
- **Socket.IO Client** para eventos en tiempo real
- **TypeScript** para tipado estático

### Decisiones de Diseño

**¿Por qué Prisma y no Sequelize?**
- Mejor experiencia de desarrollo con autocompletado
- Migrations automáticas y más confiables
- Type-safety nativo con TypeScript
- Cliente de base de datos más moderno

**¿Por qué React Query en lugar de Redux?**
- React Query es especializado en estado del servidor (API calls, cache, sincronización)
- Menos boilerplate que Redux
- Cache inteligente y re-fetching automático
- Context API es suficiente para estado local simple (auth)

**¿Por qué Socket.IO?**
- Fácil integración con Express
- Manejo automático de reconexiones
- Sistema de rooms para agrupar eventos por partido
- Fallback a long polling si WebSockets no está disponible

## 📂 Estructura del Proyecto

```
frafut/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Modelos de base de datos
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts        # Configuración de Prisma
│   │   │   └── env.ts             # Variables de entorno
│   │   ├── middleware/
│   │   │   ├── auth.ts            # Autenticación y autorización
│   │   │   ├── errorHandler.ts   # Manejo global de errores
│   │   │   └── validator.ts      # Validación de requests
│   │   ├── modules/
│   │   │   ├── auth/              # Módulo de autenticación
│   │   │   ├── championships/    # Módulo de campeonatos
│   │   │   ├── teams/             # Módulo de equipos
│   │   │   ├── players/           # Módulo de jugadores
│   │   │   ├── matches/           # Módulo de partidos
│   │   │   └── statistics/        # Módulo de estadísticas
│   │   ├── utils/
│   │   │   ├── jwt.ts             # Utilidades JWT
│   │   │   └── response.ts        # Utilidades de respuesta
│   │   └── index.ts               # Punto de entrada del servidor
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── contexts/
    │   │   └── AuthContext.tsx    # Contexto de autenticación
    │   ├── navigation/
    │   │   └── AppNavigator.tsx   # Configuración de navegación
    │   ├── screens/
    │   │   ├── auth/              # Pantallas de autenticación
    │   │   ├── championships/     # Pantallas de campeonatos
    │   │   ├── matches/           # Pantallas de partidos
    │   │   ├── teams/             # Pantallas de equipos
    │   │   └── admin/             # Pantallas de administración
    │   ├── services/
    │   │   ├── api.ts             # Cliente Axios configurado
    │   │   └── socket.ts          # Cliente Socket.IO
    │   ├── types/
    │   │   └── index.ts           # Tipos TypeScript
    │   └── utils/
    ├── App.tsx
    ├── app.json
    ├── package.json
    └── tsconfig.json
```

## 📊 Modelo de Datos

### Entidades Principales

#### User
- `id`: UUID (PK)
- `email`: String (único)
- `password`: String (hasheado)
- `firstName`, `lastName`: String
- `role`: Enum (ADMIN, ORGANIZER, USER)

#### Championship
- `id`: UUID (PK)
- `name`, `location`, `category`: String
- `startDate`, `endDate`: DateTime
- `status`: Enum (UPCOMING, ACTIVE, FINISHED, CANCELLED)
- `creatorId`: FK → User

#### Team
- `id`: UUID (PK)
- `name`, `category`: String
- `logo`: String (URL)
- `managerId`: FK → User

#### Player
- `id`: UUID (PK)
- `firstName`, `lastName`: String
- `jerseyNumber`: Int
- `position`: Enum (PORTERO, DEFENSA, MEDIOCAMPISTA, DELANTERO)
- `teamId`: FK → Team

#### Match
- `id`: UUID (PK)
- `matchDate`: DateTime
- `location`, `field`: String
- `status`: Enum (SCHEDULED, LIVE, FINISHED, etc.)
- `homeScore`, `awayScore`: Int
- `championshipId`: FK → Championship
- `homeTeamId`, `awayTeamId`: FK → Team

#### MatchEvent
- `id`: UUID (PK)
- `eventType`: Enum (GOAL, YELLOW_CARD, RED_CARD, etc.)
- `minute`: Int
- `matchId`: FK → Match
- `playerId`: FK → Player

#### Standing
- `id`: UUID (PK)
- `played`, `won`, `drawn`, `lost`: Int
- `goalsFor`, `goalsAgainst`, `points`: Int
- `championshipId`: FK → Championship
- `teamId`: FK → Team

### Relaciones

- **User** → Championship (1:N) - Un usuario crea múltiples campeonatos
- **Championship** ↔ Team (N:M) - Campeonatos tienen múltiples equipos
- **Team** → Player (1:N) - Un equipo tiene múltiples jugadores
- **Championship** → Match (1:N) - Un campeonato tiene múltiples partidos
- **Match** → MatchEvent (1:N) - Un partido tiene múltiples eventos
- **Championship** → Standing (1:N) - Tabla de posiciones por campeonato

## 🔌 API REST

### Endpoints de Autenticación

```
POST   /api/auth/register       # Registrar usuario
POST   /api/auth/login          # Iniciar sesión
GET    /api/auth/me             # Obtener perfil (auth)
PUT    /api/auth/profile        # Actualizar perfil (auth)
```

### Endpoints de Campeonatos

```
GET    /api/championships                    # Listar campeonatos
POST   /api/championships                    # Crear campeonato (auth)
GET    /api/championships/:id                # Obtener campeonato
PUT    /api/championships/:id                # Actualizar campeonato (auth)
DELETE /api/championships/:id                # Eliminar campeonato (auth)
POST   /api/championships/:id/teams          # Agregar equipo (auth)
DELETE /api/championships/:id/teams/:teamId  # Remover equipo (auth)
```

### Endpoints de Equipos

```
GET    /api/teams           # Listar equipos
POST   /api/teams           # Crear equipo (auth)
GET    /api/teams/:id       # Obtener equipo
PUT    /api/teams/:id       # Actualizar equipo (auth)
DELETE /api/teams/:id       # Eliminar equipo (auth)
```

### Endpoints de Jugadores

```
GET    /api/players/team/:teamId    # Listar jugadores por equipo
GET    /api/players/:id             # Obtener jugador
POST   /api/players                 # Crear jugador (auth)
PUT    /api/players/:id             # Actualizar jugador (auth)
DELETE /api/players/:id             # Eliminar jugador (auth)
```

### Endpoints de Partidos

```
GET    /api/matches/championship/:championshipId  # Listar partidos por campeonato
GET    /api/matches/:id                           # Obtener partido
GET    /api/matches/:id/events                    # Obtener eventos del partido
POST   /api/matches                               # Crear partido (auth)
PUT    /api/matches/:id                           # Actualizar partido (auth)
DELETE /api/matches/:id                           # Eliminar partido (auth)
POST   /api/matches/:id/events                    # Agregar evento (auth)
```

### Endpoints de Estadísticas

```
GET    /api/statistics/championships/:id/standings    # Tabla de posiciones
GET    /api/statistics/championships/:id/top-scorers  # Tabla de goleadores
GET    /api/statistics/championships/:id/cards        # Estadísticas de tarjetas
```

### Socket.IO Events

#### Cliente → Servidor
```javascript
socket.emit('join-match', matchId)    // Unirse a sala de partido
socket.emit('leave-match', matchId)   // Salir de sala de partido
```

#### Servidor → Cliente
```javascript
socket.on('new-match-event', (event) => {
  // Recibir evento de partido en tiempo real
})
```

## 🚀 Instrucciones de Instalación y Ejecución

### Requisitos Previos

- **Node.js** v20+ ([Descargar](https://nodejs.org/))
- **PostgreSQL** v14+ ([Descargar](https://www.postgresql.org/download/))
- **npm** o **yarn**
- **Expo CLI**: `npm install -g expo-cli` (para frontend)

### 1. Configurar Backend

```bash
# Navegar a la carpeta del backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones (DATABASE_URL, JWT_SECRET, etc.)

# Crear base de datos en PostgreSQL
createdb football_championship

# Ejecutar migraciones de Prisma
npx prisma migrate dev --name init

# Generar cliente de Prisma
npx prisma generate

# (Opcional) Abrir Prisma Studio para ver la base de datos
npx prisma studio

# Iniciar servidor en modo desarrollo
npm run dev

# El servidor estará corriendo en http://localhost:3000
```

### 2. Configurar Frontend

```bash
# Navegar a la carpeta del frontend
cd frontend

# Instalar dependencias
npm install

# Actualizar la URL de la API en src/services/api.ts
# Cambiar 'http://localhost:3000/api' por tu URL si es diferente

# Iniciar la aplicación
npm start

# Para ejecutar en Android
npm run android

# Para ejecutar en iOS (solo en Mac)
npm run ios

# Para ejecutar en web
npm run web
```

### 3. Variables de Entorno (Backend)

Crear archivo `.env` en la carpeta `backend/`:

```env
PORT=3000
DATABASE_URL="postgresql://usuario:password@localhost:5432/football_championship?schema=public"
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_cambiar_en_produccion
JWT_REFRESH_SECRET=tu_refresh_secret_muy_seguro_aqui
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Crear Usuario Administrador (Opcional)

Puedes crear un seed script en `prisma/seed.ts` o usar Prisma Studio para crear el primer usuario admin manualmente.

## 📱 Pantallas de la Aplicación Móvil

### Pantallas Públicas
1. **Login**: Inicio de sesión con email y contraseña
2. **Registro**: Crear nueva cuenta de usuario

### Pantallas Principales
3. **Lista de Campeonatos**: Visualiza todos los campeonatos con filtros por estado
4. **Detalle de Campeonato**:
   - Tabla de posiciones
   - Tabla de goleadores
   - Lista de partidos
5. **Detalle de Partido (Minuto a minuto)**:
   - Marcador en vivo
   - Timeline de eventos en tiempo real
   - Información del partido
6. **Detalle de Equipo**:
   - Información del equipo
   - Lista de jugadores

### Pantallas de Administración (Roles: ADMIN, ORGANIZER)
7. **Panel de Administración**:
   - Crear campeonatos
   - Gestionar equipos
   - Gestionar jugadores
   - Programar partidos
   - Registrar eventos de partido en tiempo real

## 🧪 Pruebas

### Ejecutar Tests del Backend

```bash
cd backend
npm test
```

### Flujo de Prueba Manual

1. **Registro de usuario**: Crear cuenta desde la app
2. **Crear campeonato**: Usuario ADMIN crea un campeonato
3. **Registrar equipos**: Agregar equipos al campeonato
4. **Registrar jugadores**: Agregar jugadores a cada equipo
5. **Programar partidos**: Crear partidos entre equipos
6. **Iniciar partido en vivo**: Cambiar estado a LIVE
7. **Registrar eventos**: Agregar goles, tarjetas, etc.
8. **Ver en tiempo real**: Verificar que los eventos aparecen instantáneamente
9. **Verificar tabla**: Comprobar que la tabla de posiciones se actualiza

## 📖 Ejemplos de Uso de la API

### Registro de Usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "firstName": "Juan",
    "lastName": "Pérez"
  }'
```

### Crear Campeonato

```bash
curl -X POST http://localhost:3000/api/championships \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Copa Verano 2024",
    "location": "Lima, Perú",
    "startDate": "2024-01-15T00:00:00Z",
    "category": "Primera División",
    "rules": "Partidos de 90 minutos"
  }'
```

### Registrar Evento de Partido

```bash
curl -X POST http://localhost:3000/api/matches/MATCH_ID/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "eventType": "GOAL",
    "minute": 23,
    "playerId": "PLAYER_ID",
    "teamId": "TEAM_ID",
    "description": "Gol de tiro libre"
  }'
```

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con **bcrypt**
- ✅ Autenticación basada en **JWT**
- ✅ Validación de datos con **express-validator**
- ✅ Roles y permisos (ADMIN, ORGANIZER, USER)
- ✅ Protección de rutas sensibles
- ✅ CORS configurado

## 🌐 Despliegue en Producción

### Backend (Railway, Render, Heroku)

1. Configurar variables de entorno en el servicio
2. Conectar base de datos PostgreSQL
3. Ejecutar migraciones: `npx prisma migrate deploy`
4. Iniciar servidor: `npm start`

### Frontend (Expo)

```bash
# Build para Android
expo build:android

# Build para iOS
expo build:ios

# Publicar en Expo
expo publish
```

## 🤝 Contribuciones

Este es un proyecto base. Puedes extenderlo con:

- Sistema de notificaciones push
- Chat en vivo durante partidos
- Transmisión de video
- Estadísticas avanzadas (posesión, tiros a puerta, etc.)
- Sistema de apuestas
- Múltiples idiomas
- Modo offline

## 📄 Licencia

MIT

---

**Desarrollado con ❤️ para la comunidad futbolera**
