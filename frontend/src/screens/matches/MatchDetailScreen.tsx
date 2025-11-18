import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import socketService from '../../services/socket';
import { Match, MatchEvent } from '../../types';

const MatchDetailScreen = ({ route }: any) => {
  const { id } = route.params;
  const [liveEvents, setLiveEvents] = useState<MatchEvent[]>([]);

  const { data: match, isLoading } = useQuery({
    queryKey: ['match', id],
    queryFn: async () => {
      const response = await api.get<{ data: Match }>(`/matches/${id}`);
      return response.data.data;
    },
  });

  const { data: events } = useQuery({
    queryKey: ['match-events', id],
    queryFn: async () => {
      const response = await api.get<{ data: MatchEvent[] }>(`/matches/${id}/events`);
      return response.data.data;
    },
  });

  useEffect(() => {
    if (events) {
      setLiveEvents(events);
    }
  }, [events]);

  useEffect(() => {
    // Conectar a Socket.IO
    socketService.connect();
    socketService.joinMatch(id);

    // Escuchar eventos en tiempo real
    socketService.onMatchEvent((newEvent: MatchEvent) => {
      console.log('Nuevo evento recibido:', newEvent);
      setLiveEvents((prev) => [...prev, newEvent]);
    });

    return () => {
      socketService.leaveMatch(id);
      socketService.offMatchEvent();
    };
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const getEventIcon = (eventType: string): string => {
    const icons: { [key: string]: string } = {
      GOAL: '⚽',
      YELLOW_CARD: '🟨',
      RED_CARD: '🟥',
      SUBSTITUTION: '🔄',
      KICK_OFF: '🏁',
      HALF_TIME: '⏸️',
      SECOND_HALF_START: '▶️',
      FULL_TIME: '🏁',
      OWN_GOAL: '⚽',
    };
    return icons[eventType] || '📝';
  };

  const getEventDescription = (event: MatchEvent): string => {
    if (event.description) return event.description;

    const playerName = event.player
      ? `${event.player.firstName} ${event.player.lastName}`
      : '';

    switch (event.eventType) {
      case 'GOAL':
        return `¡GOL! ${playerName}`;
      case 'YELLOW_CARD':
        return `Tarjeta amarilla para ${playerName}`;
      case 'RED_CARD':
        return `Tarjeta roja para ${playerName}`;
      case 'SUBSTITUTION':
        return `Cambio: ${playerName}`;
      case 'KICK_OFF':
        return 'Inicio del partido';
      case 'HALF_TIME':
        return 'Fin del primer tiempo';
      case 'SECOND_HALF_START':
        return 'Inicio del segundo tiempo';
      case 'FULL_TIME':
        return 'Fin del partido';
      default:
        return event.eventType;
    }
  };

  return (
    <View style={styles.container}>
      {/* Marcador */}
      <View style={styles.scoreBoard}>
        <View style={styles.team}>
          <Text style={styles.teamName}>{match?.homeTeam.name}</Text>
          <Text style={styles.score}>{match?.homeScore}</Text>
        </View>
        <View style={styles.separator}>
          <Text style={styles.vs}>VS</Text>
          {match?.status === 'LIVE' && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>EN VIVO 🔴</Text>
            </View>
          )}
        </View>
        <View style={styles.team}>
          <Text style={styles.score}>{match?.awayScore}</Text>
          <Text style={styles.teamName}>{match?.awayTeam.name}</Text>
        </View>
      </View>

      {/* Información del partido */}
      <View style={styles.matchInfo}>
        <Text style={styles.matchInfoText}>
          📍 {match?.location} {match?.field ? `- ${match.field}` : ''}
        </Text>
        <Text style={styles.matchInfoText}>
          📅 {match && new Date(match.matchDate).toLocaleString('es-PE')}
        </Text>
      </View>

      {/* Timeline de eventos */}
      <View style={styles.timelineHeader}>
        <Text style={styles.timelineTitle}>Minuto a Minuto</Text>
      </View>

      <ScrollView style={styles.timeline}>
        {liveEvents.length === 0 ? (
          <Text style={styles.noEvents}>No hay eventos registrados aún</Text>
        ) : (
          liveEvents
            .slice()
            .reverse()
            .map((event, index) => (
              <View key={`${event.id}-${index}`} style={styles.eventCard}>
                <View style={styles.eventMinute}>
                  <Text style={styles.minuteText}>{event.minute}'</Text>
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventIcon}>{getEventIcon(event.eventType)}</Text>
                  <Text style={styles.eventDescription}>
                    {getEventDescription(event)}
                  </Text>
                </View>
              </View>
            ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreBoard: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  score: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  separator: {
    alignItems: 'center',
  },
  vs: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.7,
  },
  liveBadge: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  matchInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timelineHeader: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeline: {
    flex: 1,
    padding: 15,
  },
  noEvents: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  eventMinute: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  minuteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  eventContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  eventDescription: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
  },
});

export default MatchDetailScreen;
