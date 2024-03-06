import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useReportData } from '../context/DataContext';

function MapComponent({ onLocationSelected }) {
  const { reportData, setMarkerPosition } = useReportData();


  // Implement map functionality
  const handlePress = (e) => {
    const location = e.nativeEvent.coordinate;
    setMarkerPosition(location);
  };

  const handleLocationSelected = (location) => {
    setMarkerPosition(location);
    //navigation.navigate('ReportDetails', { location });
  };

  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.2, 
        longitudeDelta: 0.2,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {reportData.location && (
        <MapView style={styles.map} initialRegion={reportData.location} onPress={handlePress}>
          {reportData.markerPosition && <Marker coordinate={reportData.markerPosition} />}
        </MapView>
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapComponent;
