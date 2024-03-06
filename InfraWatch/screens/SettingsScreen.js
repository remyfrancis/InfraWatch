import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const SettingsScreen = () => {
  // Dummy state for switches - replace with your state management logic
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(false);
  const [isLocationVisible, setIsLocationVisible] = React.useState(false);

  const toggleNotifications = () => setIsNotificationsEnabled(previousState => !previousState);
  const toggleLocationVisibility = () => setIsLocationVisible(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Account</Text>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>John Doe</Text>
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>johndoe@example.com</Text>
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Password</Text>
        <Text style={styles.value}>********</Text>
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Notifications</Text>
        <Switch
          onValueChange={toggleNotifications}
          value={isNotificationsEnabled}
        />
      </View>

      <Text style={styles.heading}>Privacy Controls</Text>
      <View style={styles.settingRow}>
        <Text style={styles.label}>See My Location</Text>
        <Switch
          onValueChange={toggleLocationVisibility}
          value={isLocationVisible}
        />
      </View>

      <Text style={styles.heading}>Support</Text>
      <View style={styles.settingRow}>
        <Text style={styles.label}>I Need Help</Text>
        <Text style={styles.value}>FAQs</Text>
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>I Have A Safety Concern</Text>
        <Text style={styles.value}>Report</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
});

export default SettingsScreen;
