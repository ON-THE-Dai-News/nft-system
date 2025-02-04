/*==========================
    UPLOAD IMAGE TO IPFS
==========================*/
// js-integration/utils/uploadImageToIPFS.js

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory path using import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Specify the path to the .env.local file in the root directory
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import axios from 'axios';
import pinataSDK from '@pinata/sdk';
import stream from 'stream';

// Initialize Pinata SDK
const pinata = new pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_API_KEY
);

// Function to upload image to IPFS
export const uploadImageToIPFS = async (imageData, metadata) => {
    try {
        // Convert base64 to buffer
        const imageBuffer = Buffer.from(imageData, 'base64');

        // Convert buffer to readable stream
        const readableStream = stream.Readable.from(imageBuffer);

        // Upload image to IPFS via Pinata
        const ipfsResponse = await pinata.pinFileToIPFS(readableStream, {
            pinataMetadata: {
                name: `${metadata.page_id}.png`,
            },
        });

        // Construct IPFS URL
        const ipfsImageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsResponse.IpfsHash}`;
        console.log('Image uploaded to IPFS:', ipfsImageUrl);

        return ipfsImageUrl;
    } catch (error) {
        console.error('Error uploading image to IPFS:', error);
        throw error;
    }
};