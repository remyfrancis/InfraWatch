import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
import MapComponent from '../components/MapComponent'; // Import the Map Component
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const ReportsMapScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const reportsRef = ref(db, 'reports');

    // Fetch reports from the database
    const unsubscribe = onValue(reportsRef, (snapshot) => {
        const data = snapshot.val();
        const reportsArray = data ? Object.keys(data).map(key => ({
            ...data[key],
            id: key
        })) : [];
        setReports(reportsArray);
        setLoading(false);
    });

    return () => {
        unsubscribe();
    }
  }, []);

    if(loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Map</Text>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

  return (
    <View style={styles.container}>
      <MapComponent reports={reports} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ReportsMapScreen;
