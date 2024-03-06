import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import ReportIssueScreen from '../screens/ReportIssueScreen';
import ReportDetailsScreen from '../screens/ReportDetailsScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsScreen from '../screens/SettingsScreen';
import HelpAndFeedbackScreen from '../screens/HealthandFeedbackScreen';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Report Issue"
        component={ReportIssueScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Interactive Map"
        component={ReportDetailsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={WelcomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Updates"
        component={HelpAndFeedbackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;