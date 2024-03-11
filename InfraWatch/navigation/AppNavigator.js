import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator'; 
import ReportDetailsScreen from '../screens/ReportDetailsScreen';
import ReportIssueScreen from '../screens/ReportIssueScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import UserReportsScreen from '../screens/UserReportsScreen';
import ReportsMapScreen from '../screens/ReportsMapScreen';
import ReportEditScreen from '../screens/ReportEditScreen';
import AuthorityDashboard from '../screens/AuthorityDashboardScreen';
import MappedReportScreen from '../screens/MappedReportScreen';



const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Report Details" component={ReportDetailsScreen} />
        <Stack.Screen name="Reports Map" component={ReportsMapScreen} />
        <Stack.Screen name="Profile Setup" component={ProfileSetupScreen} />
        <Stack.Screen name="User Reports" component={UserReportsScreen} />
        <Stack.Screen name="ReportEditScreen" component={ReportEditScreen} />
        <Stack.Screen name="Authority Dashboard" component={AuthorityDashboard} />
        <Stack.Screen name="ReportIssueScreen" component={ReportIssueScreen} />
        <Stack.Screen name="Mapped Report" component={MappedReportScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;

