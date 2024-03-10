// ProfileSetupScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
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
      <Button
        title="Save Profile"
        onPress={handleSaveProfile}
      />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setIsAdmin(!isAdmin)} style={styles.checkbox}>
          {isAdmin && <View style={styles.checkboxInner} />}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Are you an authority?</Text>
      </View>
      
      {isAdmin && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Authority Name"
            value={authorityName}
            onChangeText={setAuthorityName}
          />
          <Text style={styles.label}>Specialization:</Text>
          <Picker
            selectedValue={specialization}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setSpecialization(itemValue)}>
            {specializations.map(specialization => (
              <Picker.Item key={specialization} label={specialization} value={specialization} />
            ))}
          </Picker>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxInner: {
    width: 14,
    height: 14,
    backgroundColor: '#000',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  picker: {
    width: '100%',
    marginVertical: 10,
  },
  label: {
    alignSelf: 'flex-start',
    marginTop: 20,
  },
});

export default ProfileSetupScreen;
