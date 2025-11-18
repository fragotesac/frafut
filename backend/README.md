# Backend - Sistema de Campeonatos de Fútbol

API REST con Socket.IO para la gestión de campeonatos de fútbol.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración

# Ejecutar migraciones
npx prisma migrate dev

# Generar cliente de Prisma
npx prisma generate

# Iniciar en desarrollo
npm run dev
```

## 📦 Scripts Disponibles

- `npm run dev` - Iniciar servidor en modo desarrollo
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Iniciar servidor en producción
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:generate` - Generar cliente de Prisma
- `npm run prisma:studio` - Abrir Prisma Studio
- `npm test` - Ejecutar tests

## 🔧 Configuración

Archivo `.env`:

```env
PORT=3000
DATABASE_URL="postgresql://usuario:password@localhost:5432/football_championship"
JWT_SECRET=tu_secret_aqui
JWT_REFRESH_SECRET=tu_refresh_secret_aqui
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

## 📚 Estructura de Módulos

Cada módulo sigue la estructura:
```
modules/
  ├── auth/
  │   ├── auth.service.ts      # Lógica de negocio
  │   ├── auth.controller.ts   # Manejo de requests
  │   └── auth.routes.ts       # Definición de rutas
```

## 🔌 Socket.IO

El servidor Socket.IO corre en el mismo puerto que Express. Los clientes pueden conectarse y unirse a rooms de partidos específicos:

```javascript
socket.emit('join-match', matchId);
socket.on('new-match-event', (event) => {
  // Evento recibido
});
```

## 📊 Base de Datos

El proyecto usa **Prisma ORM** con **PostgreSQL**. El schema está en `prisma/schema.prisma`.

Para visualizar la base de datos:
```bash
npx prisma studio
```
