/*====================
    NFT AUTOMATION
====================*/
// js-integration/automation/nftAutomation.js

import { fetchMetadata } from './fetchMetadata.js';
import { uploadToIPFS } from './uploadToIPFS.js';

// Function to automate NFT creation
export const automateNFTCreation = async () => {
  try {
    console.log("Starting NFT automation...");

    // Step 1: Generate today's date (in 'yyyy-mm-dd' format)
    const today = new Date();
    const date = today.toISOString().split('T')[0];  // Example: '2025-02-02'

    // Step 2: Fetch breaking news metadata (already in the required format)
    const metadata = await fetchMetadata(date);
    console.log("Fetched breaking news and metadata:", metadata);

    // Step 3: Process each headline by uploading image + metadata
    const updatedMetadata = [];
    
    for (const news of metadata) {
      console.log(`Processing news item: ${news.title}`);

      // Upload image and metadata to IPFS
      const { imageUrl, metadataUrl } = await uploadToIPFS(news);
      console.log(`Uploaded image and metadata to IPFS: ${imageUrl}, ${metadataUrl}`);

      // Store the updated metadata (optional)
      updatedMetadata.push({ imageUrl, metadataUrl });
    }

    console.log("All news items processed successfully!");

    return updatedMetadata; // Optionally return the final result

  } catch (error) {
    console.error("Error during NFT automation:", error);
    throw error;
  }
};