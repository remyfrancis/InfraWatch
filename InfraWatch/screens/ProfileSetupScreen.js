// ProfileSetupScreen.js
import React, { useState } from 'react';
import { View, ScrollView, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { auth, db } from '../firebaseConfig';
import { ref, update, get } from "firebase/database";

const ProfileSetupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [reportCount, setReportCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authorityName, setAuthorityName] = useState('');
  const [specialization, setSpecialization] = useState('');

  const specializations = ["Road Damage", "Electricity Infrastructure Damage", "Mold & Indoor Air Quality", "Pest Infestation", "Graffiti", "Vandalism", "Water Infrastructure Damage", "Public Infrastructure Damage"];

  const handleSaveProfile = () => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Please enter both name and email.');
      return;
    }

    // Save user profile information to Firebase Realtime Database
    const profileRef = ref(db, 'users/' + userId + '/profile');
    // First, get the current profile data
  get(profileRef).then((snapshot) => {
    if (snapshot.exists()) {
      const currentProfile = snapshot.val();
      // Check if reportCount is 0 or undefined before updating
      let updates = {
        name,
        email,
        address,
        isAuthority
      };

      // Only set reportCount if it's currently 0 or undefined in the database
      if (currentProfile.reportCount === 0 || currentProfile.reportCount === undefined) {
        updates.reportCount = reportCount;
      }

      // Update the profile with the conditional reportCount
      update(profileRef, updates).then(() => {
        Alert.alert('Success', 'Profile saved successfully!');
        // Optionally navigate to another screen or reset form fields here
      }).catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to save profile.');
      });

    } else {
      // Profile does not exist, so we can set the data directly
      update(profileRef, {
        name,
        email,
        address,
        isAuthority,
        reportCount, // Assuming you want to initialize reportCount to 0 for new profiles
      }).then(() => {
        Alert.alert('Success', 'Profile created successfully!');
      }).catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to create profile.');
      });
    }
  }).catch((error) => {
    console.error(error);
    Alert.alert('Error', 'Failed to retrieve profile.');
  });
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxLabel}>Are you an authority?</Text>
        <TouchableOpacity
          style={[styles.checkbox, isAdmin ? styles.checkboxChecked : null]}
          onPress={() => setIsAdmin(!isAdmin)}
        >
          {isAdmin && <View style={styles.checkboxInner} />}
        </TouchableOpacity>
      </View>
      {isAdmin && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Authority Name"
            value={authorityName}
            onChangeText={setAuthorityName}
          />
          <Picker
            selectedValue={specialization}
            style={styles.picker}
            onValueChange={(itemValue) => setSpecialization(itemValue)}
          >
            {specializations.map(specialization => (
              <Picker.Item key={specialization} label={specialization} value={specialization} />
            ))}
          </Picker>
        </>
      )}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginVertical: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
    marginVertical: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#777',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007BFF', // or any color you prefer for checked state
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  label: {
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: '#0353A4', // Use your app's theme color or any color of choice
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '100%', // Ensure the button is as wide as the input fields
    alignItems: 'center', // Center the text horizontally
    marginTop: 10, // Add some margin at the top to separate it from the fields above
  },
  saveButtonText: {
    color: '#FFFFFF', // White color for the text to contrast the button's background color
    fontSize: 16,
    fontWeight: 'bold', // Optional: make the text bold
  },
});

export default ProfileSetupScreen;
