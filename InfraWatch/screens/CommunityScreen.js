import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import * as Sharing from 'expo-sharing'; // Expo's Sharing API
import { auth, db } from '../firebaseConfig';

const CommunityScreen = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const reportsRef = ref(db, 'reports');

    onValue(reportsRef, (snapshot) => {
      const reportsData = snapshot.val();
      const filteredReports = Object.keys(reportsData || {}).reduce((acc, key) => {
        const report = reportsData[key];
        console.log(report.score);
        // TODO: Remove undefined before finishing
        if (report.score === undefined | report.score >= 0) {
          acc.push({ id: key, ...report });
        }
        return acc;
      }, []);
      
      setReports(filteredReports);
    });
  }, []);

  const handleUpvote = (reportId) => {
    const db = getDatabase();
    const upvotesRef = ref(db, `reports/${reportId}/upvotes`);
    onValue(upvotesRef, (snapshot) => {
      const currentUpvotes = snapshot.val() || 0;
      set(upvotesRef, currentUpvotes + 1);
    }, { onlyOnce: true });
  };
  

  const handleShare = async (report) => {
    const message = `${report.title}: ${report.details}`;
    await Sharing.shareAsync(message);
  };

  const renderItem = ({ item }) => (
    <View style={styles.reportItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.details}</Text>
      <Button title="Share" onPress={() => handleShare(item)} />
      {/* Include Upvote and Downvote buttons here */}
    </View>
  );

  return (
    <FlatList
      data={reports}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  reportItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
  },
});

export default CommunityScreen;
