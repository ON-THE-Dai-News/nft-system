// utils/ipfs.js
import axios from 'axios';
import pinataSDK from '@pinata/sdk';

const pinata = new pinataSDK(process.env.NEXT_PUBLIC_PINATA_API_KEY, process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY);

/**
 * Uploads a file to IPFS using Pinata
 * @param {File} file - The file to upload
 * @returns {string} - The IPFS URL of the uploaded file
 */
export const uploadToIPFS = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const result = await pinata.pinFileToIPFS(formData);
    return `https://ipfs.io/ipfs/${result.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

/**
 * Uploads metadata to IPFS as a JSON file
 * @param {object} metadata - The metadata object to upload
 * @returns {string} - The IPFS URL of the uploaded metadata
 */
export const uploadMetadataToIPFS = async (metadata) => {
  try {
    const result = await pinata.pinJSONToIPFS(metadata);
    return `https://ipfs.io/ipfs/${result.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
};