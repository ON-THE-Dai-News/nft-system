/*======================
    APPEND IPFS URLS
======================*/
// js-integration/utils/appendIPFSUrls.js

import axios from 'axios';

/**
 * Appends IPFS URLs to the active news JSON file
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Array} updatedMetadata - Array of objects with imageUrl and metadataUrl
 */
export const appendIPFSUrlsToJSON = async (date, updatedMetadata) => {
  try {
    // Prepare the data to send - only include necessary information
    const ipfsUpdates = updatedMetadata.map(item => ({
      page_id: item.metadata.page_id,
      ipfs_image_url: item.imageUrl,
      ipfs_metadata_url: item.metadataUrl
    }));

    console.log('IPFS Updates to send:', JSON.stringify(ipfsUpdates, null, 2));

    // Send IPFS URLs to the backend server
    const response = await axios.post('http://localhost:5000/update-ipfs-urls', 
      {
        date: date,
        updates: ipfsUpdates
      }, 
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Server response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error appending IPFS URLs:', 
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

/**
 * Enhances the NFT automation process to include IPFS URL appending
 * @param {Function} originalAutomateNFTCreation - The original automation function
 * @returns {Function} Modified automation function
 */
export const enhanceNFTAutomation = (originalAutomateNFTCreation) => {
  return async () => {
    try {
      // Run the original automation process
      const updatedMetadata = await originalAutomateNFTCreation();

      // Get today's date in the same format as used in file naming
      const today = new Date();
      const date = today.toLocaleDateString('en-CA');

      // Append IPFS URLs to the JSON file
      await appendIPFSUrlsToJSON(date, updatedMetadata);

      return updatedMetadata;
    } catch (error) {
      console.error('Enhanced NFT automation failed:', error);
      throw error;
    }
  };
};