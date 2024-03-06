import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const IconTitleRowComponent = () => {
    return (
      <View style={styles.container}>
        {[1, 2, 3].map((item, index) => (
          <View key={index} style={styles.row}>
            {/* Left Icon */}
            <Icon name="info" size={24} color="black" />
            {/* Title */}
            <Text style={styles.title}>Title {item}</Text>
            {/* Right Icon */}
            <Icon name="chevron-right" size={24} color="black" style={styles.rightIcon} />
          </View>
        ))}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
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
  
  export default IconTitleRowComponent;
  