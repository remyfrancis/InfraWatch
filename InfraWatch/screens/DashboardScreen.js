import React, { useState, useEffect, useFocusEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native';
import { Icon } from 'react-native-elements'
import { auth, db } from '../firebaseConfig';
import { getDatabase, ref, onValue, get } from "firebase/database";
import * as Location from 'expo-location';



function DashboardScreen({ navigation }) {

    const [reports, setReports] = useState([]);
    const [reportsSubmitted, setReportsSubmitted] = useState(0);
    const [resolvedIssues, setResolvedIssues] = useState(0);
    const [userId, setUserId] = useState('');

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
        const db = getDatabase();
    
        const fetchReports = async (userReports) => {
            const fetchedReports = [];
        
            for (const reportId of Object.keys(userReports)) {
                console.log(`Fetching report: ${reportId}`);
                // Directly access each report using its ID
                const reportSnapshot = await get(ref(db, `reports/${reportId}`));
                if (reportSnapshot.exists()) {
                    const reportData = reportSnapshot.val();
                    console.log(`Fetched data for report ${reportId}:`, reportData);
                    // Optionally, fetch and format location data here
                    const readableLocation = reportData.location
                      ? await getReadableLocation(reportData.location.latitude, reportData.location.longitude)
                      : "Location unavailable";
                    fetchedReports.push({ ...reportData, readableLocation, id: reportId });
                }
            }
            
            setReports(fetchedReports);
            setReportsSubmitted(fetchedReports.length);
        };
    
        const user = auth.currentUser;
        if(user) {
            setUserId(user.uid);
            const userProfileRef = ref(db, `users/${user.uid}/profile`);
    
            onValue(userProfileRef, async (snapshot) => {
                const data = snapshot.val();
                if (data && data.userReports) {
                  await fetchReports(data.userReports);
                } else {
                  setReports([]);
                  setReportsSubmitted(0);
                }
            });
        }
    }, [userId]);

    return (
        <ScrollView style={styles.container}>
            
            {/* Top Row Split into 2 Columns */}
            
            <View style={styles.topRow}>
                <View style={styles.halfWidth}>
                    <Text style={styles.centerText}>Reports Submitted</Text>
                    <Text style={styles.largeText}>{reportsSubmitted}</Text>
                </View>
                <View style={styles.halfWidth}>
                    <Text style={styles.centerText}>Resolved Issues</Text>
                    <Text style={styles.largeText}>{resolvedIssues}</Text>
                </View>
            </View>
            

            {/* 2nd Row, 1 Full Width Column */}
            <View style={styles.fullWidth}>
                <Text style={styles.leftText}>Average response time</Text>
                <Text style={styles.largeText}>1 day</Text>
            </View>

            {/* User Reports */}
            <View style={styles.reportSection}>
                <Text style={styles.sectionTitle}>Reports You've Made:</Text>
                {reports.slice().reverse().map((report, index) => (
                    <View key={index} style={styles.issueRow}>
                        <View style={styles.issueTextContainer}>
                            <Text style={styles.mediumText}>{report.title || 'No Reports Yet!'}</Text>
                            <Text>{report.readableLocation || 'Unknown Location'}</Text>
                            <Text>{report.details || 'No details provided'}</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={{ uri: report.imageUrl }} // Example image
                            />
                        </View>
                    </View>
                ))}
            </View>

            <View>
                <View style={styles.row}>
                    <Icon name="location-on" size={24} color="black" style={styles.icon} />
                    <Text style={styles.title}>View Map </Text>
                    <Icon name="chevron-right" size={24} color="black" style={styles.rightIcon} />
                </View>
                <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('User Reports')}>
                    <Icon name="location-on" size={24} color="black" style={styles.icon} />
                    <Text style={styles.title}>See All My Reports </Text>
                    <Icon name="chevron-right" size={24} color="black" style={styles.rightIcon} />
                </TouchableOpacity>
                <View style={styles.row}>
                    <Icon name="chat-bubble-outline" size={24} color="black" style={styles.icon} />
                    <Text style={styles.title}>Community Feedback </Text>
                    <Icon name="chevron-right" size={24} color="black" style={styles.rightIcon} />
                </View>
                <View style={styles.row}>
                    <Icon name="notifications-none" size={24} color="black" style={styles.icon} />
                    <Text style={styles.title}>Notifications </Text>
                    <Icon name="chevron-right" size={24} color="black" style={styles.rightIcon} />
                </View>
            </View>
        </ScrollView>
  );
}

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


export default DashboardScreen;
