import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RidesListScreen from '../screens/RidesListScreen';
import RideDetailScreen from '../screens/RideDetailScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function RidesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="RidesList" component={RidesListScreen} options={{ title: 'Поиск поездок' }} />
      <Stack.Screen name="RideDetail" component={RideDetailScreen} options={{ title: 'Детали поездки' }} />
    </Stack.Navigator>
  );
}