import React, { useEffect, useState } from 'react';
import { View, Text, Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const checkLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await Geolocation.requestAuthorization('whenInUse');
    return hasPermission === 'granted';
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  return false;
};

const DrivingCheckScreen = () => {
  useEffect(() => {
    const checkSpeed = async () => {
      const hasLocationPermission = await checkLocationPermission();

      if (!hasLocationPermission) return;

      Geolocation.watchPosition(
        (position) => {
          const speed = position.coords.speed; // Speed in meters per second
          const speedLimit = 13.89; // Approx 50 km/h in m/s

          if (speed > speedLimit) {
            Alert.alert('Warning', 'The app cannot be used while driving.');
          }
        },
        (error) => {
          console.log(error);
        },
        { distanceFilter: 10 }, // Update every 10 meters.
      );
    };

    checkSpeed();
  }, []);

  return (
    <View>
      <Text>Speed Check Active</Text>
    </View>
  );
};

export default DrivingCheckScreen;
