import React from 'react';
import { View, TextInput, Button } from 'react-native';

function IssueForm({ location }) {
  // Form submission logic
  const handleSubmit = () => {
    // Submit issue details
  };

  return (
    <View>
      <TextInput placeholder="Describe the issue" />
      {/* Additional form inputs as needed */}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

export default IssueForm;
