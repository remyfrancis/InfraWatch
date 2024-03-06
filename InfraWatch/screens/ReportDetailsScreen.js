import React from 'react';
import { View, Text, ScrollView, Image, TextInput, Button, StyleSheet } from 'react-native';
import { useReportData } from '../context/DataContext';
// Assume these components are imported from your project's component library
// import Header from '../components/Header';
// import ImageCarousel from '../components/ImageCarousel';
// import LocationComponent from '../components/LocationComponent';
// import CommentsComponent from '../components/CommentsComponent';

function ReportDetailsScreen({ route, navigation }) {
  const { reportData } = useReportData(); // Destructure to get reportData directly

  // Assuming you have a field for the image URL in reportData. Adjust as necessary.
  const imageUri = reportData.selectedImage || 'default_image_uri_if_needed';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{reportData.reportTitle}</Text>
      {/* Update to use imageUri. Add conditional rendering if necessary */}
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.detailsSection}>
        <Text style={styles.detailText}>Description: {reportData.reportDetails}</Text>
        <Text style={styles.detailText}>Type: {reportData.reportType}</Text>
        {/* Assuming you add a field for status in reportData */}
        <Text style={styles.detailText}>Status: {reportData.status || 'Pending'}</Text>
        {/* Placeholder for additional components */}
      </View>
      <View style={styles.actionButtons}>
        <Button title="Upvote" onPress={() => {}} />
        <Button title="Follow" onPress={() => {}} />
        <Button title="Share" onPress={() => {}} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
});

export default ReportDetailsScreen;

