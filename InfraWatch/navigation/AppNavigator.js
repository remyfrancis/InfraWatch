import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator'; 
import ReportDetailsScreen from '../screens/ReportDetailsScreen';
import ReportIssueScreen from '../screens/ReportIssueScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={BottomTabNavigator} />
        <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} />
        <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;

