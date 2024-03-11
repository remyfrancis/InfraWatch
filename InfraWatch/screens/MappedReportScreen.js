import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import * as Location from 'expo-location';

const MappedReportScreen = ({ route }) => {
    const { report } = route.params;
    const [readableLocation, setReadableLocation] = useState(report.readableLocation || 'Loading location...');
  
    useEffect(() => {
      const fetchReadableLocation = async () => {
        if (report.location && !report.readableLocation) {
          const { latitude, longitude } = report.location;
          const response = await Location.reverseGeocodeAsync({ latitude, longitude });
          if (response.length > 0) {
            const { street, city, region, country } = response[0];
            setReadableLocation(`${street}, ${city}, ${region}, ${country}`);
          } else {
            setReadableLocation('No location available');
          }
        }
      };
  
      fetchReadableLocation();
    }, [report]);
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{report.title}</Text>
        <Text style={styles.text}>Details: {report.details}</Text>
        <Text style={styles.text}>Location: {readableLocation}</Text>
        <Text style={styles.text}>Urgency: {report.urgency}</Text>
        {report.imageUrl ? (
          <Image source={{ uri: report.imageUrl }} style={styles.image} />
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    text: {
      fontSize: 18,
      marginBottom: 5,
    },
    image: {
      width: '100%',
      height: 300,
      resizeMode: 'cover',
      marginTop: 10,
    },
  });

export default MappedReportScreen;