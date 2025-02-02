/*====================
    UPLOAD TO IPFS
====================*/
// js-integration/automation/uploadToIPFS.js

import { uploadImageToIPFS } from '@/utils/uploadImageToIPFS';
import { uploadMetadataToIPFS } from '@/utils/uploadMetadataToIPFS';

// Function to orchestrate the upload of image and metadata to IPFS
export const uploadToIPFS = async (metadata) => {
  try {
    console.log("Uploading image and metadata to IPFS...");

    // Step 1: Upload the image to IPFS
    const ipfsImageUrl = await uploadImageToIPFS(metadata.image_url, metadata);
    console.log(`Image uploaded to IPFS: ${ipfsImageUrl}`);

    // Step 2: Append the ipfs_image_url to the metadata
    const updatedMetadata = {
      ...metadata,
      ipfs_image_url: ipfsImageUrl,
    };

    // Step 3: Upload the metadata to IPFS
    const metadataUrl = await uploadMetadataToIPFS(updatedMetadata);
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