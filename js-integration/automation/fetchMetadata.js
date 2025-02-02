/*=============================
    FETCH NEWS INFO METADATA
=============================*/
// js-integration/automation/fetchMetadata.js

import axios from 'axios';

// Function to fetch the active news JSON from backend-2.0
export const fetchMetadata = async (date) => {
  try {
    // Construct the URL to access the JSON file dynamically with the correct naming convention
    const url = `http://localhost:5000/backups/activeNewsInfo_${date}.json`;

    // Fetch the JSON from the backend service
    const response = await axios.get(url);
    const newsData = response.data;

    // Log the data (optional, for debugging)
    console.log("Fetched active news data:", newsData);

    return newsData;
  } catch (error) {
    console.error("Error fetching active news info:", error);
    throw error;
  }
};