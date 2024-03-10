import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import * as Location from 'expo-location';

const AuthorityDashboard = ({ navigation }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const reportsRef = ref(db, 'reports');

    const unsubscribe = onValue(reportsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data && data.userReports) {
        const reportsWithLocation = await Promise.all(Object.values(data.userReports).map(async report => {
          if(report.location) {
            const readableLocation = await getReadableLocation(report.location.latitude, report.location.longitude);
            return { ...report, readableLocation };
          }
          return report;
        }));
        setReports(reportsWithLocation);
        setReportsSubmitted(data.reportCount || 0);
    }
      const reportsArray = data ? Object.keys(data).map(key => ({
        ...data[key],
        id: key
      })).sort((a, b) => a.urgency > b.urgency ? -1 : 1) : []; // Assuming each report has an 'urgency' field
      setReports(reportsArray);
    });

    return () => unsubscribe();
  }, []);


  const getReadableLocation = async (latitude, longitude) => {
    const permissionGranted = await requestLocationPermission();
    if (!permissionGranted) {
        // Handle the case when permissions are not granted
        console.log("Location permissions are not granted.");
        return;
    }
    
    try {
        const results = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (results.length > 0) {
        // Format the address as needed; here, we're using the first result
        const { city, street, region, country } = results[0];
        return `${street ? street + ', ' : ''}${city ? city + ', ' : ''}${region ? region + ', ' : ''}${country}`;
        }
    } catch (error) {
        console.error("Failed to get location: ", error);
    }
    return "Location unavailable"; // Default text or handling when the location can't be fetched
};

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Report Details', { reportId: item.id })}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.readableLocation || 'Unknown Location'}</Text>
      <Text>Urgency: {item.urgency}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reports Dashboard</Text>
      <FlatList
        data={reports}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
  },
});

export default AuthorityDashboard;