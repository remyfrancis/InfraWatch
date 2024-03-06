import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
//import * as ImagePicker from 'expo-image-picker';
import MapComponent from '../components/MapComponent';
import { useReportData } from '../context/DataContext';
import * as Haptics from 'expo-haptics';



function ReportIssueScreen({ navigation }) {
  const [reportTitle, setReportTitle] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportType, setReportType] = useState('road_damage');
  const [selectedImage, setSelectedImage] = useState(null);

  const { reportData, updateReportData } = useReportData();

  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  };

  const handleSubmit = () => {
    // Submit your data here, you might want to validate the inputs before submission
    Alert.alert('Report Submitted', 'Your report has been submitted successfully!');
  };

  const handleCancel = () => {
    // Reset state or navigate to a different screen
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
      <MapComponent />
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

