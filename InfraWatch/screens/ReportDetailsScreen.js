import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { getDatabase, ref, onValue, update, get } from 'firebase/database';
import { auth } from '../firebaseConfig';
import * as Location from 'expo-location';
import SingleLocationComponent from '../components/SingleLocationMapComponent';



const urgencyLevels = ['Low', 'Medium', 'High'];

const getNextUrgency = (currentUrgency, increase = true) => {
  const currentIndex = urgencyLevels.indexOf(currentUrgency);
  if (increase) {
    // Increase urgency level, but don't exceed the maximum
    return currentIndex < urgencyLevels.length - 1 ? urgencyLevels[currentIndex + 1] : currentUrgency;
  } else {
    // Decrease urgency level, but don't go below the minimum
    return currentIndex > 0 ? urgencyLevels[currentIndex - 1] : currentUrgency;
  }
};

const ReportDetailsScreen = ({ route, navigation }) => {
  const { reportId } = route.params;
  const [report, setReport] = useState(null);
  const [isAuthority, setIsAuthority] = useState(false);

  useEffect(() => {
    const fetchReportDetails = async () => {
      const currentUser = auth.currentUser;
      const db = getDatabase();

      if (currentUser) {
        const userRef = ref(db, `users/${currentUser.uid}/profile`);
        get(userRef).then((snapshot) => {
          if (snapshot.exists() && snapshot.val().isAuthority) {
            setIsAuthority(true);
          }
        });
      }

      const reportRef = ref(db, `reports/${reportId}`);
      onValue(reportRef, async (snapshot) => {
        const reportData = snapshot.val();
        if (reportData && reportData.location) {
          const [location] = await Location.reverseGeocodeAsync({
            latitude: reportData.location.latitude,
            longitude: reportData.location.longitude,
          });
          const readableLocation = `${location.city}, ${location.region}, ${location.country}`;
          setReport({ ...reportData, readableLocation });
        } else {
          setReport(reportData);
        }
      });
    };

    fetchReportDetails();
  }, [reportId]);

  const changeUrgency = (increase) => {
    if (!report || !report.urgency) return;
    const newUrgency = getNextUrgency(report.urgency, increase);
    const db = getDatabase();
    update(ref(db, `reports/${reportId}`), { urgency: newUrgency })
      .then(() => {
        Alert.alert("Urgency Updated", `Report urgency changed to ${newUrgency}.`);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", "Could not update report urgency.");
      });
  };

  const markResolved = () => {
    const db = getDatabase();
    update(ref(db, `reports/${reportId}`), { resolved: true }).then(() => {
      Alert.alert("Report Resolved", "The report has been marked as resolved.");
      navigation.goBack();
    }).catch((error) => {
      console.error(error);
      Alert.alert("Error", "Could not mark report as resolved.");
    });
  };

  if (!report) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{report.title}</Text>
      <SingleLocationComponent location={report.location} />
      <Text>Location: {report.readableLocation || 'Loading location...'}</Text>
      <Text>Details: {report.details}</Text>
      <Text>Urgency: {report.urgency}</Text>
      <Text>Status: {report.resolved ? 'Resolved' : 'Open'}</Text>
      {isAuthority && (
        <>
          <Button title="Increase Urgency" onPress={() => changeUrgency(true)} />
          <Button title="Decrease Urgency" onPress={() => changeUrgency(false)} />
          <Button title="Mark as Resolved" onPress={markResolved} />
        </>
      )}
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F4F8', // Light gray background for slight contrast
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Darker text for better readability
  },
  detailText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#444', // Slightly lighter text
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF', // iOS blue button
    color: 'white',
    padding: 10,
    borderRadius: 5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ReportDetailsScreen;


