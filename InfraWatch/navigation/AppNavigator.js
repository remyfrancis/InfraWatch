import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator'; 
import ReportDetailsScreen from '../screens/ReportDetailsScreen';
import ReportIssueScreen from '../screens/ReportIssueScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import UserReportsScreen from '../screens/UserReportsScreen';
import ReportsMapScreen from '../screens/ReportsMapScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Report Details" component={ReportDetailsScreen} />
        <Stack.Screen name="Reports Map" component={ReportsMapScreen} />
        <Stack.Screen name="Profile Setup" component={ProfileSetupScreen} />
        <Stack.Screen name="User Reports" component={UserReportsScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;

