/*=============================
    UPLOAD METADATA TO IPFS
============================*/
// js-integration/utils/uploadMetadataToIPFS.js

import pinataSDK from '@pinata/sdk';

// Initialize Pinata SDK
const pinata = new pinataSDK(process.env.NEXT_PUBLIC_PINATA_API_KEY, process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY);

// Function to upload metadata to IPFS
export const uploadMetadataToIPFS = async (metadata) => {
  try {
    // Step 1: Convert the metadata to JSON
    const metadataJson = JSON.stringify(metadata);

    // Step 2: Upload the JSON metadata to Pinata
    const ipfsResponse = await pinata.pinJSONToIPFS(metadataJson, {
      pinataMetadata: {
        name: metadata.page_id,
      },
    });

    // Generate the IPFS URL for the metadata
    const metadataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsResponse.IpfsHash}`;
    console.log('Metadata uploaded to IPFS:', metadataUrl);

    return metadataUrl;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
};