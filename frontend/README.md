# Frontend - App Móvil de Campeonatos de Fútbol

Aplicación móvil desarrollada con React Native y Expo.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar Expo
npm start

# Para Android
npm run android

# Para iOS (solo Mac)
npm run ios

# Para Web
npm run web
```

## ⚙️ Configuración

Antes de iniciar, actualiza la URL del backend en:

**`src/services/api.ts`**:
```typescript
const API_URL = 'http://TU_IP:3000/api';
```

**`src/services/socket.ts`**:
```typescript
const SOCKET_URL = 'http://TU_IP:3000';
```

**Nota**: Para Android, usa tu IP local (ej: `http://192.168.1.5:3000`) en lugar de `localhost`.

## 📱 Pantallas Principales

1. **Login/Registro** - Autenticación de usuarios
2. **Lista de Campeonatos** - Visualización de torneos
3. **Detalle de Campeonato** - Posiciones, goleadores, partidos
4. **Minuto a Minuto** - Seguimiento en vivo de partidos
5. **Panel Admin** - Gestión de campeonatos (solo ADMIN/ORGANIZER)

## 🏗️ Arquitectura

- **React Query** - Gestión de estado del servidor
- **Context API** - Estado local (autenticación)
- **Socket.IO** - Comunicación en tiempo real
- **React Navigation** - Navegación entre pantallas

## 🎨 Estilos

El proyecto usa `StyleSheet` nativo de React Native para mejor rendimiento.

## 📦 Dependencias Principales

- `@react-navigation/native` - Navegación
- `@tanstack/react-query` - Gestión de estado
- `axios` - Llamadas HTTP
- `socket.io-client` - WebSockets
- `expo` - Framework React Native

## 🔐 Autenticación

Los tokens JWT se almacenan en `AsyncStorage` y se incluyen automáticamente en todas las requests a través de un interceptor de Axios.
