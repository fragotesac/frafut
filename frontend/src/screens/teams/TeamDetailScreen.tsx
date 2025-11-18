import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Team, Player } from '../../types';

const TeamDetailScreen = ({ route }: any) => {
  const { id } = route.params;

  const { data: team, isLoading } = useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      const response = await api.get<{ data: Team & { players: Player[] } }>(`/teams/${id}`);
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const renderPlayer = ({ item }: { item: Player }) => (
    <View style={styles.playerCard}>
      <View style={styles.jerseyNumber}>
        <Text style={styles.jerseyNumberText}>{item.jerseyNumber}</Text>
      </View>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.playerPosition}>{item.position}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.teamName}>{team?.name}</Text>
        <Text style={styles.teamCategory}>{team?.category}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plantilla de Jugadores</Text>
        <FlatList
          data={team?.players || []}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay jugadores registrados</Text>
          }
        />
      </View>
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
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  teamCategory: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  section: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  playerCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  jerseyNumber: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  jerseyNumberText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  playerPosition: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
  },
});

export default TeamDetailScreen;
