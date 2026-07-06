import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import RidesStack from './RidesStack';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import BecomeDriverScreen from '../screens/BecomeDriverScreen';
import StatsScreen from '../screens/StatsScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Search: 'search',
            MyBookings: 'bookmark',
            BecomeDriver: 'car',
            Stats: 'stats-chart',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Search" component={RidesStack} options={{ headerShown: false, title: 'Поиск' }} />
      <Tab.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'Мои поездки' }} />
      <Tab.Screen name="BecomeDriver" component={BecomeDriverScreen} options={{ title: 'Стать водителем' }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ title: 'Статистика' }} />
    </Tab.Navigator>
  );
}