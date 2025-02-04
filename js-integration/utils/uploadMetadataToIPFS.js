/*=============================
    UPLOAD METADATA TO IPFS
============================*/
// js-integration/utils/uploadMetadataToIPFS.js

import pinataSDK from '@pinata/sdk';

// Initialize Pinata SDK
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

/**
 * Formats breaking news metadata into NFT-compatible format
 * @param {Object} newsData Raw news data
 * @param {string} ipfsImageUrl IPFS URL of the uploaded image
 * @returns {Object} Formatted NFT metadata
 */
/**
 * Formats breaking news metadata into NFT-compatible format
 * @param {Object} newsData Raw news data
 * @param {string} ipfsImageUrl IPFS URL of the uploaded image
 * @param {string} creator Creator name (optional, defaults to 'OTD News')
 * @returns {Object} Formatted NFT metadata
 */
const formatNFTMetadata = (newsData, ipfsImageUrl) => {
  // Create array of attributes
  const attributes = [
    {
      trait_type: 'Headline',
      value: newsData.headline
    },
    {
      trait_type: 'Source',
      value: newsData.source
    },
    {
      trait_type: 'Category',
      value: Array.isArray(newsData.category) ? newsData.category.join(', ') : newsData.category
    },
    {
      trait_type: 'Tag',
      value: newsData.tag
    },
    {
      trait_type: 'Description',
      value: newsData.description
    },
    {
      trait_type: 'Creator',
      value: newsData.creator || 'OTD News'
    }
  ].filter(attr => attr.value && attr.value !== ''); // Ensure no empty attributes

  // Create metadata object
  return {
    name: newsData.title,
    image: ipfsImageUrl,
    external_url: newsData.news_url || "", 
    attributes: attributes,
    properties: {
      name: newsData.title,
      date: newsData.date,
      page_id: newsData.page_id
    }
  };
};

/**
 * Validates the raw metadata
 * @param {Object} metadata Raw metadata object
 * @returns {boolean} Whether the metadata is valid
 */
const validateRawMetadata = (metadata) => {
  const requiredFields = ['title', 'headline', 'description', 'image_url'];
  return requiredFields.every(field => {
    const value = metadata[field];
    return value !== undefined && value !== null && value !== '';
  });
};

/**
 * Uploads metadata to IPFS
 * @param {Object} metadata Raw metadata object
 * @param {string} ipfsImageUrl IPFS URL of the uploaded image
 * @param {string} creator Creator name (optional)
 * @returns {Promise<string>} IPFS URL of the uploaded metadata
 */
export const uploadMetadataToIPFS = async (metadata, ipfsImageUrl, creator) => {
  try {
    console.log('Validating metadata...');
    
    // Validate the raw metadata
    if (!validateRawMetadata(metadata)) {
      console.error('Invalid metadata:', metadata);
      throw new Error('Missing required metadata fields');
    }

    // Format the metadata
    console.log('Formatting metadata...');
    const formattedMetadata = formatNFTMetadata(metadata, ipfsImageUrl, creator);
    console.log('Formatted metadata:', JSON.stringify(formattedMetadata, null, 2));

    // Upload the formatted metadata to Pinata
    console.log('Uploading to Pinata...');
    const ipfsResponse = await pinata.pinJSONToIPFS(formattedMetadata, {
      pinataMetadata: {
        name: `OTDNews-${metadata.page_id || metadata.title.slice(0, 30)}`,
        keyvalues: {
          type: 'OTDNews NFT Metadata',
          date: metadata.date
        }
      }
    });

    // Generate the IPFS URL for the metadata
    const metadataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsResponse.IpfsHash}`;
    console.log('Metadata uploaded to IPFS:', metadataUrl);

    return metadataUrl;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    if (metadata) {
      console.error('Problematic metadata:', JSON.stringify(metadata, null, 2));
    }
    throw error;
  }
};