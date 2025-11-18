import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ChampionshipsListScreen from '../screens/championships/ChampionshipsListScreen';
import ChampionshipDetailScreen from '../screens/championships/ChampionshipDetailScreen';
import MatchDetailScreen from '../screens/matches/MatchDetailScreen';
import TeamDetailScreen from '../screens/teams/TeamDetailScreen';
import AdminScreen from '../screens/admin/AdminScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ChampionshipsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChampionshipsList"
        component={ChampionshipsListScreen}
        options={{ title: 'Campeonatos' }}
      />
      <Stack.Screen
        name="ChampionshipDetail"
        component={ChampionshipDetailScreen}
        options={{ title: 'Detalle del Campeonato' }}
      />
      <Stack.Screen
        name="MatchDetail"
        component={MatchDetailScreen}
        options={{ title: 'Partido en Vivo' }}
      />
      <Stack.Screen
        name="TeamDetail"
        component={TeamDetailScreen}
        options={{ title: 'Equipo' }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ORGANIZER';

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ChampionshipsTab"
        component={ChampionshipsStack}
        options={{ title: 'Campeonatos', headerShown: false }}
      />
      {isAdmin && (
        <Tab.Screen
          name="AdminTab"
          component={AdminScreen}
          options={{ title: 'Administración' }}
        />
      )}
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Aquí podrías mostrar un splash screen
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainTabs />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
