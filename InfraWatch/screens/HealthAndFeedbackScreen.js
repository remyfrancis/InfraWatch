import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure you have installed react-native-vector-icons
import { useNavigation } from '@react-navigation/native';


const HelpAndFeedbackScreen = ({ navigation }) => {
  // Example navigation function, replace with actual navigation logic
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName); // Placeholder, use navigation.navigate(screenName) in a real app
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.settingRow} 
        onPress={() => navigateToScreen('ReportAProblem')}>
        <Text style={styles.label}>Report A Problem</Text>
        <Icon name="chevron-right" size={20} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.settingRow} 
        onPress={() => navigateToScreen('FAQs')}>
        <Text style={styles.label}>FAQs</Text>
        <Icon name="chevron-right" size={20} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.settingRow} 
        onPress={() => navigateToScreen('CommunityStandards')}>
        <Text style={styles.label}>Community Standards</Text>
        <Icon name="chevron-right" size={20} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.settingRow} 
        onPress={() => navigateToScreen('Profile Setup')}>
        <Text style={styles.label}>Profile Setup</Text>
        <Icon name="chevron-right" size={20} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.settingRow} 
        onPress={() => navigateToScreen('Authority Dashboard')}>
        <Text style={styles.label}>Authority Dashboard</Text>
        <Icon name="chevron-right" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc', // Light grey border for each item
  },
  label: {
    fontSize: 16,
  },
});

export default HelpAndFeedbackScreen;
