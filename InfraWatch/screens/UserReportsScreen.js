import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Image  } from 'react-native';
import { getDatabase, ref, query, orderByKey, limitToLast, startAfter, get } from 'firebase/database';

const PAGE_SIZE = 10; // Number of reports to fetch per page

const UserReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastKey, setLastKey] = useState('');
  const [allLoaded, setAllLoaded] = useState(false);

  const fetchReports = async () => {
    if (loading || allLoaded) return;
  
    setLoading(true);
    const db = getDatabase();
    let queryConstraints = [orderByKey(), limitToLast(PAGE_SIZE + 1)]; // +1 to check if there's more
    if (lastKey) queryConstraints.push(startAfter(lastKey));
  
    const reportsQuery = query(ref(db, 'reports'), ...queryConstraints);
    const snapshot = await get(reportsQuery);
  
    if (!snapshot.exists()) {
      setAllLoaded(true);
      setLoading(false);
      return;
    }
  
    const fetchedReports = [];
    let newLastKey = '';
    snapshot.forEach((childSnapshot) => {
      newLastKey = childSnapshot.key;
      fetchedReports.unshift(childSnapshot.val()); // unshift to reverse the order
    });
  
    // Remove one item if we fetched PAGE_SIZE + 1 reports to maintain correct pagination
    if (fetchedReports.length > PAGE_SIZE) {
      fetchedReports.shift(); // Remove the first item which is beyond our page limit
    } else {
      setAllLoaded(true); // If we fetched <= PAGE_SIZE reports, we've reached the end
    }
  
    setReports(prevReports => [...fetchedReports, ...prevReports]);
    setLastKey(newLastKey);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
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
                source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }} // Fallback image URL
              />
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
