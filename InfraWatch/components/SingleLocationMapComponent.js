import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const styles = StyleSheet.create({
  container: {
    height: 200, // Set the height of the map
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

function SingleLocationComponent({ location }) {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      setCurrentLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } else {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
          return;
        }

        let userLocation = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      })();
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={currentLocation} showsUserLocation={!location}>
        {location && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={"Report Location"}
            description={"This is where the issue was reported."}
          />
        )}
      </MapView>
    </View>
  );
}

export default SingleLocationComponent;
