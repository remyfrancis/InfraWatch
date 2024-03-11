import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useReportData } from '../context/DataContext';
import * as Haptics from 'expo-haptics';
import { db, storage, auth } from '../firebaseConfig';
import { ref as storageRef, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  getDatabase,
  ref,
  set,
  push,
  serverTimestamp,
  runTransaction
} from "firebase/database";

export const uploadFile = async (fileUri, path) => {
  const response = await fetch(fileUri);
  const blob = await response.blob();
  const storage = getStorage();
  const storageReference = storageRef(storage, path);
  const snapshot = await uploadBytes(storageReference, blob);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  console.log("image url: ", downloadUrl);
  return downloadUrl;
};

function ReportIssueScreen({ navigation }) {
  const [reportTitle, setReportTitle] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportType, setReportType] = useState('road_damage');
  const [selectedImage, setSelectedImage] = useState(null);
  const [userReportCount, setUserReportCount] = useState(0);
  const [score, setScore] = useState(0);
  const [urgency, setUrgency] = useState('Low');

  

  

  const { reportData, updateReportData } = useReportData();

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasCameraPermission = await requestCameraPermissions();
    if (!hasCameraPermission) return;
  
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      uriList = result.assets.map((asset) => asset.uri);
      setSelectedImage(uriList[0]);
      console.log("Photo URI: ", uriList[0]);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    //console.log(result);

    if (!result.canceled) {
      uriList = result.assets.map((asset) => asset.uri);
      setSelectedImage(uriList[0]);
      console.log("Image URI: ", uriList[0])
    }
  };


  const [userId, setUserId] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setUserId(user.uid);
    }
  }, [user]);

  // Handler for setting urgency
  const selectUrgency = (level) => {
    setUrgency(level);
  };

  const handleSubmit = async () => {
    // Validate inputs before submission
    if (!reportTitle || !reportDetails || !reportType) {
      Alert.alert('Validation Failed', 'Please fill all the fields.');
      return;
    }
  
    // Request location permission and get the current location
    let location = { latitude: null, longitude: null };
    const locationStatus = await Location.requestForegroundPermissionsAsync();
    if (locationStatus.status !== 'granted') {
      Alert.alert('Permission Denied', 'Cannot fetch location without permission.');
      return;
    } else {
      const currentLocation = await Location.getCurrentPositionAsync({});
      location = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
    }
  
    // Handle image upload
    let imageUrl = '';
    if (selectedImage) {
      imageUrl = await uploadFile(selectedImage, `photos/${userId}/${Date.now()}`);
    }
  
    const db = getDatabase();
    const reportRef = ref(db, 'reports');
    const newReportKey = push(reportRef).key;
  
    const reportData = {
      userId: userId,
      reportId: newReportKey,
      title: reportTitle,
      details: reportDetails,
      type: reportType,
      imageUrl: imageUrl,
      score: score,
      urgency: urgency,
      location: location,
      createdAt: serverTimestamp(),
    };
  
    // Add report to the global reports path
    await set(ref(db, `reports/${newReportKey}`), reportData);
  
    // Add report ID reference to the user's profile
    const userProfileRef = ref(db, `users/${userId}/profile/userReports/${newReportKey}`);
    await set(userProfileRef, true);
  
    // Update user's report count if necessary
    runTransaction(ref(db, `users/${userId}/profile/reportCount`), (currentCount) => {
      return (currentCount || 0) + 1;
    });
  
    Alert.alert('Report Submitted', 'Your report has been submitted successfully!');
    navigation.goBack();
  };

  

  const handleCancel = () => {
    // Reset state or navigate to a different screen
    setReportTitle('');
    setReportDetails('');
    setReportType('Select a report type');
    setSelectedImage(null);

    Alert.alert("Cancelled!", "Your report has been cancelled");
    navigation.goBack();
  };

  //TODO: Implement Haptic feedback. You can implment onPress={triggerImpact} on the buttons
  // const triggerImpact = () => {
  //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  // };

  // const triggerNotification = () => {
  //   Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  // };

  // const triggerSelection = () => {
  //   Haptics.selectionAsync();
  // };


  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TextInput
          style={styles.input}
          placeholder="Report Title"
          value={reportTitle}
          onChangeText={setReportTitle}
        />
        <TextInput
          style={styles.textArea}
          placeholder="Report Details"
          multiline
          numberOfLines={4}
          value={reportDetails}
          onChangeText={setReportDetails}
        />
        <Picker
          selectedValue={reportType}
          onValueChange={(itemValue, itemIndex) => setReportType(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Road Damage" value="Road Damage" />
          <Picker.Item label="Electricity Infrastructure Damage" value="Electricity Infrastructure Damage" />
          <Picker.Item label="Water Infrastructure Damage" value="Water Infrastructure Damage" />
          <Picker.Item label="Public Infrastructure Damage" value="Public Infrastructure Damage" />
          <Picker.Item label="Graffiti" value="Graffiti" />
          <Picker.Item label="Vandalism" value="Vandalism" />
        </Picker>
        <Text style={styles.label}>Urgency Level:</Text>
        <View style={styles.urgencyContainer}>
          {['Low', 'Medium', 'High'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.urgencyButton, urgency === level && styles.selectedUrgency]}
              onPress={() => selectUrgency(level)}
            >
              <Text style={styles.urgencyText}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Upload Image from Library</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Change as necessary
  },
  scrollView: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f0f0f0', // Light gray background
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc', // Light gray border
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#f0f0f0', // Light gray background
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10, // Increased padding for better visual spacing
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc', // Light gray border
    fontSize: 16,
    height: 120, // Set an initial height
    textAlignVertical: 'top', // Aligns text to the top
  },
  picker: {
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  urgencyContainer: {
    marginBottom: 15,
    flexDirection: 'column', // Each button occupies its own line
  },
  urgencyButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  selectedUrgency: {
    backgroundColor: '#006DAA', // A slightly darker background for selected urgency
  },
  urgencyText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#0353A4',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: '48%', // Adjust as necessary
    alignItems: 'center', // This aligns items (including text) horizontally in the center.
    justifyContent: 'center', // This aligns items (including text) vertically in the center.
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center', // Ensures text is centered, useful if text wraps to a new line.
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  submitButton: {
    backgroundColor: '#1B065E', // The desired color for the Submit button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: '48%', // To ensure it aligns with the layout of other buttons
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // Optional: add a border to make the button more visible
    borderColor: '#ccc', // Color for the border
  },
  cancelButtonText: {
    color: '#000', // Black text color
    fontSize: 16,
  },
});

export default ReportIssueScreen;

