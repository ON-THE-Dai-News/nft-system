/*====================
    UPLOAD TO IPFS
====================*/
// js-integration/automation/uploadToIPFS.js

import { uploadImageToIPFS } from '../utils/uploadImageToIPFS.js';
import { uploadMetadataToIPFS } from '../utils/uploadMetadataToIPFS.js';
import axios from 'axios';

/**
 * Function to orchestrate the upload of image and metadata to IPFS
 * @param {Object} metadata The news metadata
 * @param {string} creator Optional creator name
 * @returns {Promise<Object>} Object containing IPFS URLs for image and metadata
 */
export const uploadToIPFS = async (metadata, creator) => {
  try {
    console.log("Uploading image and metadata to IPFS...");

    // Step 1: Upload the image to IPFS using base64 image_data
    const ipfsImageUrl = await uploadImageToIPFS(metadata.image_data, metadata);
    console.log(`Image uploaded to IPFS: ${ipfsImageUrl}`);

    // Step 2: Upload the metadata to IPFS with the image URL and creator
    const metadataUrl = await uploadMetadataToIPFS(metadata, ipfsImageUrl, creator);
    console.log(`Metadata uploaded to IPFS: ${metadataUrl}`);

    // Step 3: Send to backend server for saving to OTDNews Spreadsheet
    try {
      console.log('Sending IPFS URL Update:', {
        page_id: metadata.page_id,
        ipfs_image_url: ipfsImageUrl
      });

      const response = await axios.post('http://localhost:5000/update-ipfs-url', {
        page_id: metadata.page_id,
        ipfs_image_url: ipfsImageUrl
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Backend update response:', response.data);
    } catch (backendError) {
      console.error('Error updating backend with IPFS URL:', backendError);
    }

    // Return both the image and metadata IPFS URLs
    return {
      imageUrl: ipfsImageUrl,
      metadataUrl: metadataUrl,
      metadata: metadata
    };

  } catch (error) {
    console.error("Error during IPFS upload process:", error);
    throw error;
  }
};