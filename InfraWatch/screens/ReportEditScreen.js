// ReportEditScreen.js
import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from './ReportIssueScreen';
import { auth } from '../firebaseConfig';

const ReportEditScreen = ({ route, navigation }) => {
  const { reportId } = route.params;
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState(null);


  // Image Selection
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
  
    if (!result.canceled) {
        uriList = result.assets.map((asset) => asset.uri);
      setImage(uriList[0]);
    }
  };
  
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work.');
      return;
    }
  
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
        uriList = result.assets.map((asset) => asset.uri);
      setImage(uriList[0]);
    }
  };
  


  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('No user found');
      return;
    }
    const db = getDatabase();
    const reportRef = ref(db, `reports/${reportId}`);
  
    onValue(reportRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTitle(data.title);
        setDetails(data.details);
        if (data.imageUrl) { // Ensure there's an imageUrl to set
          setImage(data.imageUrl); // This line sets the current image URL
          console.log("Current Image URL: ", data.imageUrl);
        }
        setIsLoading(false);
      } else {
        console.log("No data found for this report.");
      }
    }, {
      onlyOnce: true
    });
  }, [reportId]);

  const handleSave = async () => {
    if (!title || !details) {
      Alert.alert('Error', 'Title and details cannot be empty.');
      return;
    }

    let imageUrl = image;

    if (image && !image.startsWith('http')) {
        // Assuming image is a local file URI and needs to be uploaded
        imageUrl = await uploadFile(image, `photos/${reportId}`);
    }
    const db = getDatabase();
    const reportRef = ref(db, `reports/${reportId}`);
    await update(reportRef, { title, details, imageUrl });

    Alert.alert('Success', 'Report updated successfully.');
    navigation.goBack();
  };

  if (isLoading) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Details"
        value={details}
        onChangeText={setDetails}
        multiline
      />
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        <Button title="Pick an Image from Gallery" onPress={pickImage} />
        <Button title="Take a Photo" onPress={takePhoto} />
        <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ReportEditScreen;
