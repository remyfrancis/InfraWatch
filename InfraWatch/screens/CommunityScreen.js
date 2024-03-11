import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';

const CommunityScreen = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('All'); // To keep track of the selected filter

  useEffect(() => {
    const db = getDatabase();
    const reportsRef = ref(db, 'reports');

    onValue(reportsRef, (snapshot) => {
      const reportsData = snapshot.val();
      let formattedReports = reportsData ? Object.keys(reportsData).map(key => ({
        id: key,
        ...reportsData[key],
      })) : [];
      
      if (filter !== 'All') {
        formattedReports = formattedReports.filter(report => filter === 'Resolved' ? report.resolved : !report.resolved);
      }

      setReports(formattedReports);
    });
  }, [filter]);

  const Pill = ({ title }) => (
    <TouchableOpacity
      style={[styles.pill, filter === title && styles.pillActive]}
      onPress={() => setFilter(title)}
    >
      <Text style={styles.pillText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={styles.reportItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.reportImage} />
      <View style={styles.reportContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <View style={styles.statusDot(item.resolved ? 'green' : 'red')} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.pillsContainer}>
        <Pill title="All" />
        <Pill title="Resolved" />
        <Pill title="Unresolved" />
      </View>
      <FlatList
        data={reports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pillsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f0f0f0', // Soft gray background for inactive pills
    borderWidth: 1,
    borderColor: '#ccc', // Light border to give some depth
  },
  pillActive: {
    backgroundColor: '#0353A4', // Blue background for the active pill
    borderWidth: 1,
    borderColor: '#003973', // Darker blue border for contrast
  },
  pillText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold', // Thicker black text for readability
  },
  pillTextActive: {
    color: '#fff', // White text for the active pill for better contrast
  },
  reportItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  reportImage: {
    width: '33%',
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  reportContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  statusDot: (color) => ({
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color,
    alignSelf: 'flex-end',
  }),
});

export default CommunityScreen;

