import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Championship } from '../../types';

const ChampionshipsListScreen = ({ navigation }: any) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['championships'],
    queryFn: async () => {
      const response = await api.get<{ data: Championship[] }>('/championships');
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

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error al cargar campeonatos</Text>
      </View>
    );
  }

  const renderChampionship = ({ item }: { item: Championship }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ChampionshipDetail', { id: item.id })}
    >
      <View style={[styles.badge, styles[`badge${item.status}`]]}>
        <Text style={styles.badgeText}>{getStatusText(item.status)}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardSubtitle}>{item.category}</Text>
      <View style={styles.cardInfo}>
        <Text style={styles.cardInfoText}>📍 {item.location}</Text>
        <Text style={styles.cardInfoText}>
          📅 {new Date(item.startDate).toLocaleDateString('es-PE')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderChampionship}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay campeonatos disponibles</Text>
        }
      />
    </View>
  );
};

const getStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    UPCOMING: 'Próximo',
    ACTIVE: 'En curso',
    FINISHED: 'Finalizado',
    CANCELLED: 'Cancelado',
  };
  return statusMap[status] || status;
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
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  badgeUPCOMING: {
    backgroundColor: '#FFF3CD',
  },
  badgeACTIVE: {
    backgroundColor: '#D1ECF1',
  },
  badgeFINISHED: {
    backgroundColor: '#D4EDDA',
  },
  badgeCANCELLED: {
    backgroundColor: '#F8D7DA',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1a1a1a',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardInfoText: {
    fontSize: 12,
    color: '#999',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ChampionshipsListScreen;
