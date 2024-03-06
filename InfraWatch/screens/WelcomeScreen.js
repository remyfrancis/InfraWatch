import React from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
        <Image
            source={require('../assets/images/welcome.jpg')} 
            style={styles.imageBackground}
            >
        </Image>
        <Text style={styles.title}>Help Keep Your Community Safe</Text>
        <Text style={styles.description}>
            You can report issues like potholes, graffiti, and other non-emergency problems.
        </Text>

        {/* Steps Section */}
        <View style={styles.stepsContainer}>
            <View style={styles.stepRow}>
            {/* Icon placeholder */}
            <View style={styles.iconContainer}><Text>Icon 1</Text></View>
            <Text style={styles.stepText}>Step 1: Take a photo. Show the issue you're reporting.</Text>
            </View>
            <View style={styles.stepRow}>
            {/* Icon placeholder */}
            <View style={styles.iconContainer}><Text>Icon 2</Text></View>
            <Text style={styles.stepText}>Step 2: Describe the issue and its location.</Text>
            </View>
            <View style={styles.stepRow}>
            {/* Icon placeholder */}
            <View style={styles.iconContainer}><Text>Icon 3</Text></View>
            <Text style={styles.stepText}>Step 3: Submit your report and help us improve.</Text>
            </View>
        </View>

        {/* Enter Button */}
        <TouchableOpacity
            onPress={() => navigation.navigate('YourNextScreenNameHere')}
            style={styles.enterButton}>
            <Text style={styles.enterButtonText}>Enter</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  imageBackground: {
    width: '100%',
    height: 200, // Adjust as needed
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  stepsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    width: '80%',
    fontSize: 16,
  },
  enterButton: {
    marginTop: 20,
    backgroundColor: '#007bff', // Example color
    padding: 10,
    borderRadius: 5,
  },
  enterButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default WelcomeScreen;
