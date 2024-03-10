import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, Text, StyleSheet, ActivityIndicator, Image, Alert  } from 'react-native';
import { getDatabase, ref, query, orderByKey, limitToLast, startAfter, get, remove, runTransaction } from 'firebase/database';
import { auth } from '../firebaseConfig';
import * as Location from 'expo-location';

const PAGE_SIZE = 10; // Number of reports to fetch per page

const UserReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastKey, setLastKey] = useState('');
  const [allLoaded, setAllLoaded] = useState(false);

  const fetchUserReports = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log("No user logged in");
      setLoading(false);
      return;
    }

    setLoading(true);
    const db = getDatabase();
    // Adjusted path to user's reports references under their profile
    const userProfilePath = `users/${currentUser.uid}/profile/userReports`;

    get(ref(db, userProfilePath)).then(async (snapshot) => {
      if (snapshot.exists()) {
        const userReportsData = snapshot.val();
        // Fetch each report by ID stored in userReports
        const reportsFetchPromises = Object.keys(userReportsData).map((reportId) => {
          return get(ref(db, `reports/${reportId}`));
        });

        const reportsSnapshots = await Promise.all(reportsFetchPromises);
        const reports = reportsSnapshots.map((reportSnapshot, index) => {
          if (reportSnapshot.exists()) {
            const reportData = reportSnapshot.val();
            // Enhance with readable location if needed
            return { ...reportData, id: Object.keys(userReportsData)[index] }; // or simply use reportId
          }
          return null; // or handle non-existing report differently
        }).filter(report => report !== null); // Filter out nulls if the report wasn't found

        // Optionally: Enhance each report with a readable location
        const reportsWithLocationPromise = reports.map(async report => {
          if (report.location) {
            report.readableLocation = await getReadableLocation(report.location.latitude, report.location.longitude);
          }
          return report;
        });

        Promise.all(reportsWithLocationPromise).then(reportsWithLocation => {
          setReports(reportsWithLocation);
          setLoading(false);
        });

      } else {
        console.log("No user reports found in profile");
        setReports([]);
        setLoading(false);
      }
    }).catch(error => {
      console.error("Failed to fetch user reports from profile: ", error);
      setLoading(false);
    });
  };

  // Delete Reports
  const deleteReport = async (reportId) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to perform this action.");
      return;
    }

    const db = getDatabase();
    // Remove the report from the global reports collection
    const globalReportRef = ref(db, `reports/${reportId}`);
    await remove(globalReportRef).catch((error) => {
      console.error("Failed to delete report from global reports: ", error);
      Alert.alert("Error", "Failed to delete report.");
    });

    // Remove the report reference from the user's profile
    const userReportRef = ref(db, `users/${currentUser.uid}/profile/userReports/${reportId}`);
    await remove(userReportRef).catch((error) => {
      console.error("Failed to delete report reference from user profile: ", error);
      Alert.alert("Error", "Failed to delete report reference.");
    });

    // Then, decrement the reportCount atomically using a transaction
    const reportCountRef = ref(db, `users/${currentUser.uid}/profile/reportCount`);
    runTransaction(reportCountRef, (currentCount) => {
      // Ensure the currentCount is not undefined and greater than 0 before decrementing
      if (currentCount > 0) {
        return currentCount - 1;
      } else {
        // In case currentCount is undefined or not greater than 0, do not decrement
        return currentCount;
      }
    }).then(() => {
      Alert.alert("Success", "Report deleted successfully.");
      // Refresh the list after deletion and reportCount update
      fetchUserReports();
    }).catch((error) => {
      console.error("Failed to decrement reportCount: ", error);
      Alert.alert("Error", "Failed to update report count.");
    });
  };



  // Edit Reports
  const editReport = (reportId) => {
    navigation.navigate('ReportEditScreen', { reportId });
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Unable to access the location. Please allow location access.');
      return false;
    }
    return true;
};

  const getReadableLocation = async (latitude, longitude) => {
    const permissionGranted = await requestLocationPermission();
    if (!permissionGranted) {
        // Handle the case when permissions are not granted
        console.log("Location permissions are not granted.");
        return;
    }
    
    try {
        const results = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (results.length > 0) {
        // Format the address as needed; here, we're using the first result
        const { city, street, region, country } = results[0];
        return `${street ? street + ', ' : ''}${city ? city + ', ' : ''}${region ? region + ', ' : ''}${country}`;
        }
    } catch (error) {
        console.error("Failed to get location: ", error);
    }
    return "Location unavailable"; // Default text or handling when the location can't be fetched
};

  useEffect(() => {
    fetchUserReports();
  }, []);
  

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Reports You've Made:</Text>
      <FlatList
        data={reports.slice().reverse()} // Reverse the reports for display
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
        <View style={styles.issueRow}>
          <View style={styles.issueTextContainer}>
            <Text style={styles.mediumText}>{item.title || 'No Reports Yet!'}</Text>
            <Text>{item.readableLocation || 'Unknown Location'}</Text>
            <Text>{item.details || 'No details provided'}</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Edit" onPress={() => editReport(item.id)} />
            <Button title="Delete" onPress={() => deleteReport(item.id)} />
          </View>
        </View>
      )}
      />
    </View>
  );
  
};


  const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    icon: {
        width: 30, // Set a specific width
        height: 30,
        backgroundColor: '#F3EEE7', // Set background color
        borderRadius: 10, // Rounded corners
        justifyContent: 'center', // Center the icon (if using a View wrapper)
        alignItems: 'center', // Center the icon (if using a View wrapper)
    },
    topRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    halfWidth: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F3EEE7', // Set background color
        borderRadius: 10, // Rounded corners
        margin: 5, // Add some margin to see the rounded corners effect
        padding: 10, // Add some padding to see the rounded corners effect
    },
    fullWidth: {
        width: '100%',
        justifyContent: 'center',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#F3EEE7', // Set background color
        borderRadius: 10, // Rounded corners
        marginVertical: 5, // Add vertical margin to separate from other elements
    },
    regularText: {
        fontSize: 16,
    },
    mediumText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    largeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    centerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    leftText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    reportSection: {
        marginTop: 10,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    issueRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    issueTextContainer: {
        flex: 2 / 3,
        justifyContent: 'center',
    },
    imageContainer: {
        flex: 1 / 3,
        height: 100, // Adjust the height as needed
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10, // Rounded corners for images
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingTop: 10,
      },
    title: {
        marginLeft: 10, // Space between icon and title
        flex: 1, // Take up remaining space
    },
    rightIcon: {
        // Ensure this icon is positioned to the far right
        marginLeft: 'auto',
    },
});

export default UserReportsScreen;
