/*==========================
    UPLOAD IMAGE TO IPFS
==========================*/
// js-integration/utils/uploadImageToIPFS.js

import axios from 'axios';
import FormData from 'form-data';
import pinataSDK from '@pinata/sdk';

// Initialize Pinata SDK
const pinata = new pinataSDK(process.env.NEXT_PUBLIC_PINATA_API_KEY, process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY);

// Function to upload image to IPFS
export const uploadImageToIPFS = async (imageUrl, metadata) => {
  try {
    // Step 1: Download the image using axios
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream',
    });

    // Step 2: Prepare the image to upload to Pinata
    const form = new FormData();
    const fileName = metadata.page_id;
    form.append('file', response.data, { filename: fileName });

    // Choose either title or page_id for the Pinata metadata name
    const name = metadata.page_id;

     // Step 3: Upload the image to IPFS via Pinata
     const ipfsResponse = await pinata.pinFileToIPFS(form, {
        pinataMetadata: {
          name: name,
        },
      });
  
      const ipfsImageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsResponse.IpfsHash}`;
      console.log('Image uploaded to IPFS:', ipfsImageUrl);
  
      return ipfsImageUrl;
  } catch (error) {
    console.error('Error uploading image to IPFS:', error);
    throw error;
  }
};