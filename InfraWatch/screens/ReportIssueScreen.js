import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapComponent from '../components/MapComponent';
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

function ReportIssueScreen({ navigation }) {
  const [reportTitle, setReportTitle] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportType, setReportType] = useState('road_damage');
  const [selectedImage, setSelectedImage] = useState(null);
  const [userReportCount, setUserReportCount] = useState(0);
  const [score, setScore] = useState(0);


  const { reportData, updateReportData } = useReportData();


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
    console.log(result);

    if (!result.canceled) {
      uriList = result.assets.map((asset) => asset.uri);
      setSelectedImage(uriList[0]);
    }
  };

  const uploadFile = async (fileUri, path) => {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const storage = getStorage();
    const storageReference = storageRef(storage, path);
    const snapshot = await uploadBytes(storageReference, blob);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log("image url: ", downloadUrl);
    return downloadUrl;
  };

  const [userId, setUserId] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setUserId(user.uid);
    }
  }, [user]);



  const handleSubmit = async () => {
    // Submit your data here, you might want to validate the inputs before submission

  let reportData;
  const db = getDatabase();
  const reportId = userId + Date.now().toString();


  // Request location permission and get the current location
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Denied', 'Cannot fetch location without permission.');
    return;
  }

    // Location Data Initialization
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;



    reportData = {
      userId: userId,
      reportId: reportId,
      title: reportTitle,
      details: reportDetails,
      type: reportType,
      imageUrl: selectedImage,
      score: score,
      location: { latitude, longitude },
      createdAt: serverTimestamp(),
    };

    if(selectedImage.length > 0) {
      reportData.imageUrl = await uploadFile(selectedImage, `photos/${reportId}`);
    }

    const newReportRef = push(ref(db, 'reports'));
    const userProfileRef = ref(db, `users/${userId}/profile`);
    const userReportCountRef = ref(db, `users/${userId}/profile/reportCount`);

    try {
      await set(newReportRef, reportData);
      runTransaction(userProfileRef, (currentData) => {
        if(currentData) {
        const reportCount = currentData.reportCount ? currentData.reportCount + 1 : 1;
        const userReports = currentData.userReports ? currentData.userReports : {};
        
        userReports[newReportRef.key] = reportData;
        
        return { ...currentData, reportCount, userReports };
        } else {
          const userReports = {};
          userReports[newReportRef.key] = reportData;
          return { reportCount: 1, userReports };
        }
      }).then((result)=>{
        if (result.committed) {
          Alert.alert('Report Submitted', 'Your report has been submitted successfully!');
          setReportTitle('');
          setReportDetails('');
          setReportType('road_damage');
          setSelectedImage(null);
          navigation.goBack();
        } else {
          console.log("Transaction not committed.");
        }
      })
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while submitting the report. Please try again.');
    }
  };

  

  const handleCancel = () => {
    // Reset state or navigate to a different screen
    setReportTitle('');
    setReportDetails('');
    setReportType('road_damage');
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
      {/*<MapComponent />*/}
      <ScrollView style={styles.scrollView}>
        <TextInput
          style={styles.input}
          placeholder="Report Title"
          value={reportTitle}
          onChangeText={setReportTitle}
        />
        <TextInput
          style={styles.input}
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
          <Picker.Item label="Road Damage" value="road_damage" />
          <Picker.Item label="Electricity Infrastructure Damage" value="electricity_infrastructure_damage" />
          <Picker.Item label="Water Infrastructure Damage" value="water_infrastructure_damage" />
          <Picker.Item label="Public Infrastructure Damage" value="public_infrastructure_damage" />
        </Picker>
        <Button title="Upload Image" onPress={pickImage} />
        {/* Show image preview or indication */}
        <Button title="Submit" onPress={handleSubmit} />
        <Button title="Cancel" onPress={handleCancel} color="#ff5c5c" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
});

export default ReportIssueScreen;

