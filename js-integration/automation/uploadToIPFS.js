/*====================
    UPLOAD TO IPFS
====================*/
// js-integration/automation/uploadToIPFS.js

import { uploadImageToIPFS } from '../utils/uploadImageToIPFS.js';
import { uploadMetadataToIPFS } from '../utils/uploadMetadataToIPFS.js';

/**
 * Function to orchestrate the upload of image and metadata to IPFS
 * @param {Object} metadata The news metadata
 * @param {string} creator Optional creator name
 * @returns {Promise<Object>} Object containing IPFS URLs for image and metadata
 */
export const uploadToIPFS = async (metadata, creator) => {
  try {
    console.log("Uploading image and metadata to IPFS...");

    // Step 1: Upload the image to IPFS
    const ipfsImageUrl = await uploadImageToIPFS(metadata.image_url, metadata);
    console.log(`Image uploaded to IPFS: ${ipfsImageUrl}`);

    // Step 2: Upload the metadata to IPFS with the image URL and creator
    const metadataUrl = await uploadMetadataToIPFS(metadata, ipfsImageUrl, creator);
    console.log(`Metadata uploaded to IPFS: ${metadataUrl}`);

    // Return both the image and metadata IPFS URLs
    return {
      imageUrl: ipfsImageUrl,
      metadataUrl: metadataUrl
    };

  } catch (error) {
    console.error("Error during IPFS upload process:", error);
    throw error;
  }
};