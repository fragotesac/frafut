import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Championship, Standing, Scorer, Match } from '../../types';

const ChampionshipDetailScreen = ({ route, navigation }: any) => {
  const { id } = route.params;
  const [activeTab, setActiveTab] = useState<'standings' | 'scorers' | 'matches'>('standings');

  const { data: championship, isLoading } = useQuery({
    queryKey: ['championship', id],
    queryFn: async () => {
      const response = await api.get<{ data: Championship }>(`/championships/${id}`);
      return response.data.data;
    },
  });

  const { data: standings } = useQuery({
    queryKey: ['standings', id],
    queryFn: async () => {
      const response = await api.get<{ data: Standing[] }>(`/statistics/championships/${id}/standings`);
      return response.data.data;
    },
    enabled: activeTab === 'standings',
  });

  const { data: scorers } = useQuery({
    queryKey: ['scorers', id],
    queryFn: async () => {
      const response = await api.get<{ data: Scorer[] }>(`/statistics/championships/${id}/top-scorers`);
      return response.data.data;
    },
    enabled: activeTab === 'scorers',
  });

  const { data: matches } = useQuery({
    queryKey: ['matches', id],
    queryFn: async () => {
      const response = await api.get<{ data: Match[] }>(`/matches/championship/${id}`);
      return response.data.data;
    },
    enabled: activeTab === 'matches',
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{championship?.name}</Text>
        <Text style={styles.subtitle}>{championship?.location}</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'standings' && styles.activeTab]}
          onPress={() => setActiveTab('standings')}
        >
          <Text style={[styles.tabText, activeTab === 'standings' && styles.activeTabText]}>
            Posiciones
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'scorers' && styles.activeTab]}
          onPress={() => setActiveTab('scorers')}
        >
          <Text style={[styles.tabText, activeTab === 'scorers' && styles.activeTabText]}>
            Goleadores
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'matches' && styles.activeTab]}
          onPress={() => setActiveTab('matches')}
        >
          <Text style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}>
            Partidos
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'standings' && (
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 2 }]}>Equipo</Text>
              <Text style={styles.tableHeaderText}>PJ</Text>
              <Text style={styles.tableHeaderText}>G</Text>
              <Text style={styles.tableHeaderText}>E</Text>
              <Text style={styles.tableHeaderText}>P</Text>
              <Text style={styles.tableHeaderText}>Pts</Text>
            </View>
            {standings?.map((standing, index) => (
              <View key={standing.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>
                  {index + 1}. {standing.team.name}
                </Text>
                <Text style={styles.tableCell}>{standing.played}</Text>
                <Text style={styles.tableCell}>{standing.won}</Text>
                <Text style={styles.tableCell}>{standing.drawn}</Text>
                <Text style={styles.tableCell}>{standing.lost}</Text>
                <Text style={[styles.tableCell, styles.pointsCell]}>{standing.points}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'scorers' && (
          <View>
            {scorers?.map((scorer, index) => (
              <View key={scorer.player.id} style={styles.scorerCard}>
                <Text style={styles.scorerPosition}>{index + 1}</Text>
                <View style={styles.scorerInfo}>
                  <Text style={styles.scorerName}>
                    {scorer.player.firstName} {scorer.player.lastName}
                  </Text>
                  <Text style={styles.scorerTeam}>{scorer.player.team?.name}</Text>
                </View>
                <Text style={styles.scorerGoals}>{scorer.goals} ⚽</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'matches' && (
          <View>
            {matches?.map((match) => (
              <TouchableOpacity
                key={match.id}
                style={styles.matchCard}
                onPress={() => navigation.navigate('MatchDetail', { id: match.id })}
              >
                <Text style={styles.matchDate}>
                  {new Date(match.matchDate).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <View style={styles.matchTeams}>
                  <View style={styles.matchTeam}>
                    <Text style={styles.matchTeamName}>{match.homeTeam.name}</Text>
                    <Text style={styles.matchScore}>{match.homeScore}</Text>
                  </View>
                  <Text style={styles.matchVs}>vs</Text>
                  <View style={styles.matchTeam}>
                    <Text style={styles.matchScore}>{match.awayScore}</Text>
                    <Text style={styles.matchTeamName}>{match.awayTeam.name}</Text>
                  </View>
                </View>
                {match.status === 'LIVE' && (
                  <View style={styles.liveBadge}>
                    <Text style={styles.liveText}>EN VIVO 🔴</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
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
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 5,
    borderRadius: 6,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  pointsCell: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  scorerCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  scorerPosition: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    width: 30,
  },
  scorerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  scorerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  scorerTeam: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  scorerGoals: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  matchCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  matchDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  matchTeams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchTeam: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchTeamName: {
    fontSize: 14,
    fontWeight: '500',
  },
  matchScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  matchVs: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 12,
  },
  liveBadge: {
    backgroundColor: '#ff3b30',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 10,
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChampionshipDetailScreen;
