import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

function MapComponent({ reports, navigation }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  //const navigation = useNavigation();
  

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922, // Adjust these values as needed
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={currentLocation}
            showsUserLocation={true}
          >
          {reports.filter(report => report.location && report.location.latitude && report.location.longitude).map((report, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: report.location.latitude, longitude: report.location.longitude }}
              title={report.title}
              description={report.details}
              onPress={() => {
                console.log(report);
                navigation.navigate('Mapped Report', { report })
              }}
            />
          ))}
        </MapView>
    </View>
  );
}



const styles = StyleSheet.create({

  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapComponent;
