import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import config from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';

// Importar rutas
import authRoutes from './modules/auth/auth.routes';
import championshipsRoutes from './modules/championships/championships.routes';
import teamsRoutes from './modules/teams/teams.routes';
import playersRoutes from './modules/players/players.routes';
import matchesRoutes from './modules/matches/matches.routes';
import statisticsRoutes from './modules/statistics/statistics.routes';

const app = express();
const httpServer = createServer(app);

// Configuración de Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*', // En producción, especificar dominios permitidos
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hacer io accesible en los controladores
app.set('io', io);

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/championships', championshipsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/statistics', statisticsRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

// Manejo de errores global
app.use(errorHandler);

// Socket.IO - Manejo de eventos en tiempo real
io.on('connection', (socket) => {
  console.log(`✅ Cliente conectado: ${socket.id}`);

  // Unirse a una sala de partido específico
  socket.on('join-match', (matchId: string) => {
    socket.join(`match:${matchId}`);
    console.log(`Cliente ${socket.id} se unió al partido ${matchId}`);
  });

  // Salir de una sala de partido
  socket.on('leave-match', (matchId: string) => {
    socket.leave(`match:${matchId}`);
    console.log(`Cliente ${socket.id} salió del partido ${matchId}`);
  });

  // Evento de nuevo evento de partido (emitido desde el controlador)
  socket.on('match-event', (data) => {
    // Emitir el evento a todos los clientes en la sala del partido
    io.to(`match:${data.matchId}`).emit('new-match-event', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
});

// Función para emitir eventos de partido desde otros módulos
export const emitMatchEvent = (matchId: string, eventData: any) => {
  io.to(`match:${matchId}`).emit('new-match-event', eventData);
};

// Iniciar servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDatabase();

    // Iniciar servidor HTTP
    httpServer.listen(config.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏆 API de Campeonatos de Fútbol                        ║
║                                                           ║
║   🚀 Servidor: http://localhost:${config.port}                  ║
║   📚 Entorno: ${config.nodeEnv}                           ║
║   🔌 WebSockets: Activo (Socket.IO)                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await disconnectDatabase();
  process.exit(0);
});

startServer();
