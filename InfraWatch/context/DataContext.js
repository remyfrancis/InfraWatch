import React, { createContext, useContext, useState } from 'react';

// Create a Context
const DataContext = createContext();

// Context Provider component
export const DataProvider = ({ children }) => {
  //const [data, setData] = useState(null); // Store your data in state

  // The context value that will be supplied to any descendants of this component.
  const [reportData, setReportData] = useState({
    reportTitle: 'Test',
    reportDetails: 'Test details',
    reportType: 'road_damage',
    selectedImage: null,
    markerPosition: null, // For storing map marker position
  });

   // Function to update report fields
  const updateReportData = (field, value) => {
    setReportData((prev) => ({ ...prev, [field]: value }));
  };

  // Function to set marker position
  const setMarkerPosition = (position) => {
    setReportData((prev) => ({ ...prev, markerPosition: position }));
  };

  // The Provider gives access to the context to its children.
  return (
    <DataContext.Provider value={{ reportData, updateReportData, setMarkerPosition }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useReportData = () => useContext(DataContext);
