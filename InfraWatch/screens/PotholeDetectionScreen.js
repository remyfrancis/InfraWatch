import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { accelerometer } from 'react-native-sensors';

const PotholeDetectionScreen = () => {
  const [joltDetected, setJoltDetected] = useState(false);

  useEffect(() => {
    // Threshold for detecting a jolt (adjust based on testing)
    const joltThreshold = 20; // Initial value, adjust based on actual testing

    const subscription = accelerometer.subscribe(({ x, y, z }) => {
      const totalAcceleration = Math.sqrt(x * x + y * y + z * z);

      // Check if the total acceleration exceeds our threshold
      if (totalAcceleration > joltThreshold) {
        setJoltDetected(true);
        // Consider debouncing this alert or limiting how often it can appear
        Alert.alert('Pothole Detected', 'Would you like to report this?', [
          { text: 'Yes', onPress: () => console.log('Report initiated.') },
          { text: 'No', onPress: () => console.log('Report canceled.') },
        ]);
      }
    });

    // Cleanup on component unmount
    return () => subscription.unsubscribe();
  }, []);

  return (
    <View>
      <Text>{joltDetected ? 'Jolt Detected!' : 'No Jolt Detected'}</Text>
    </View>
  );
};

export default PotholeDetectionScreen;
