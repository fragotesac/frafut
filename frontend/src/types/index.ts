// Tipos de usuario
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'ORGANIZER' | 'USER';
}

// Tipos de autenticación
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Tipos de campeonato
export interface Championship {
  id: string;
  name: string;
  description?: string;
  location: string;
  startDate: string;
  endDate?: string;
  category: string;
  rules?: string;
  status: 'UPCOMING' | 'ACTIVE' | 'FINISHED' | 'CANCELLED';
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// Tipos de equipo
export interface Team {
  id: string;
  name: string;
  logo?: string;
  category: string;
  representative?: string;
  phone?: string;
  email?: string;
}

// Tipos de jugador
export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  jerseyNumber: number;
  position: 'PORTERO' | 'DEFENSA' | 'MEDIOCAMPISTA' | 'DELANTERO';
  dateOfBirth?: string;
  photo?: string;
  team?: Team;
}

// Tipos de partido
export interface Match {
  id: string;
  matchDate: string;
  location: string;
  field?: string;
  status: 'SCHEDULED' | 'LIVE' | 'FIRST_HALF' | 'HALF_TIME' | 'SECOND_HALF' | 'FINISHED' | 'SUSPENDED' | 'CANCELLED';
  homeScore: number;
  awayScore: number;
  championship?: {
    id: string;
    name: string;
  };
  homeTeam: {
    id: string;
    name: string;
    logo?: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logo?: string;
  };
}

// Tipos de evento de partido
export interface MatchEvent {
  id: string;
  eventType: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'KICK_OFF' | 'HALF_TIME' | 'SECOND_HALF_START' | 'FULL_TIME' | 'OWN_GOAL';
  minute: number;
  description?: string;
  player?: {
    id: string;
    firstName: string;
    lastName: string;
    jerseyNumber: number;
  };
  teamId?: string;
}

// Tipos de tabla de posiciones
export interface Standing {
  id: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  team: {
    id: string;
    name: string;
    logo?: string;
  };
}

// Tipos de goleador
export interface Scorer {
  player: Player;
  goals: number;
}

// Tipos de tarjetas
export interface CardStats {
  player: Player;
  yellowCards: number;
  redCards: number;
  totalCards: number;
}
