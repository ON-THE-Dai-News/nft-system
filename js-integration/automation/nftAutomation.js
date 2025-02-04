/*====================
    NFT AUTOMATION
====================*/
// js-integration/automation/nftAutomation.js

import { fetchMetadata } from './fetchMetadata.js';
import { uploadToIPFS } from './uploadToIPFS.js';
import { saveIPFSUrls } from '../utils/ipfsStorage.js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: resolve(__dirname, '../../.env.local') });

// Function to check environment variables
const checkEnvVariables = () => {
  const required = ['PINATA_API_KEY', 'PINATA_SECRET_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Function to automate NFT creation
export const automateNFTCreation = async () => {
  try {
    console.log("=== Starting NFT automation ===");

    // Check environment variables first
    console.log("Checking environment variables...");
    checkEnvVariables();
    console.log("Environment variables verified ✓");

    // Generate today's date
    const today = new Date();
    const date = today.toLocaleDateString('en-CA');
    console.log(`Processing date: ${date}`);

    // Fetch breaking news metadata
    console.log("Fetching metadata from backend...");
    const metadata = await fetchMetadata(date);
    console.log(`Fetched ${metadata ? metadata.length : 0} news items`);

    if (!metadata || metadata.length === 0) {
      throw new Error("No metadata received from backend");
    }

    // Process each headline
    console.log("\nStarting to process news items:");
    const updatedMetadata = [];

    for (const [index, news] of metadata.entries()) {
      console.log(`\n[${index + 1}/${metadata.length}] Processing: "${news.title}"`);

      try {
        // Upload image and metadata to IPFS
        const result = await uploadToIPFS(news);
        console.log(`- IPFS Image URL: ${result.imageUrl}`);
        console.log(`- IPFS Metadata URL: ${result.metadataUrl}`);

        // Save IPFS URLs to local storage
        await saveIPFSUrls(news, result.imageUrl, result.metadataUrl);

        updatedMetadata.push({
          ...result,
          metadata: news
        });
      } catch (itemError) {
        console.error(`Error processing item ${index + 1}:`, itemError);
        // Continue with next item instead of stopping the whole process
        continue;
      }
    }

    console.log("\n=== NFT automation completed successfully! ===");
    console.log(`Processed ${updatedMetadata.length} items`);

    return updatedMetadata;
  } catch (error) {
    console.error("\n❌ Error during NFT automation:", error);
    throw error;
  }
};

// Auto-execute if run directly
if (import.meta.url === new URL(import.meta.resolve('./nftAutomation.js')).href) {
  automateNFTCreation()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Failed to complete NFT automation:", error);
      process.exit(1);
    });
}