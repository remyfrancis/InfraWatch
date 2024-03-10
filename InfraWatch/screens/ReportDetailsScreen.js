import React from 'react';
import { View, Text, ScrollView, Image, TextInput, Button, StyleSheet } from 'react-native';
// Assume these components are imported from your project's component library
// import Header from '../components/Header';
// import ImageCarousel from '../components/ImageCarousel';
// import LocationComponent from '../components/LocationComponent';
// import CommentsComponent from '../components/CommentsComponent';

function ReportDetailsScreen({ route, navigation }) {
  const { report } = route.params;

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{report.title}</Text>
      <Text>{report.details}</Text>
    </View>
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

