import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DataProvider } from './context/DataContext';


export default function App() {

  // const [fontsLoaded] = useFonts({
  //   'Inter-Black': require('./assets/fonts/Inter.ttc'),
  // });

  return (
    <DataProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter'
  },
});
