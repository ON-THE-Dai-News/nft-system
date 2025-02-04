/*=======================
    CONTRACT FUNCTIONS
=======================*/
// js-integration/utils/contract.js

import { ethers } from 'ethers';
import contractABI from '../contracts/OTDNewsNFT.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// Function to get all minted NFT URIs
export const getAllMintedNFTURIs = async () => {
  try {
    // Check for Web3 wallet
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Please install MetaMask or another Web3 wallet');
    }

    // Request account access if needed
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();

    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    // Get the number of NFTs owned by the current address
    const balance = await contract.balanceOf(signerAddress);
    const balanceCount = parseInt(balance.toString());

    console.log(`Total tokens owned by ${signerAddress}: ${balanceCount}`);

    // Collect all minted token URIs
    const mintedURIs = [];
    
    // Try to get token URIs in a more robust way
    for (let i = 1; i <= 100; i++) { // Adjust max iteration as needed
      try {
        const tokenURI = await contract.tokenURI(i);
        if (tokenURI) {
          mintedURIs.push(tokenURI);
          console.log(`Minted Token ${i} URI: ${tokenURI}`);
        }
      } catch (error) {
        // If tokenURI fails, it likely means the token doesn't exist
        if (mintedURIs.length > 0) {
          break;
        }
      }
    }

    return mintedURIs;
  } catch (error) {
    console.error('Error retrieving minted NFTs:', error);
    throw error;
  }
};

// Function to check available NFTs from API
export const getAvailableNFTs = async () => {
  try {
    const response = await fetch('/api/available-nfts');
    const data = await response.json();

    if (!data.nfts || data.nfts.length === 0) {
      throw new Error('No NFTs available in the API');
    }

    // Log the raw NFT data
    console.log('Raw NFT data:', data.nfts[0]);

    // Enhance NFTs with proper IPFS URLs
    const enhancedNFTs = data.nfts.map(nft => {
      // Ensure we have valid IPFS URLs
      if (!nft.ipfs_metadata_url || nft.ipfs_metadata_url === 'ipfs://undefined') {
        console.warn('Missing metadata URL for NFT:', nft.title);
        nft.ipfs_metadata_url = `ipfs://QmTuxvj47PokNfvooWKGQcYWwvAwF6DN75n9sxgGbpeNL8`;
      }
      
      if (!nft.ipfs_image_url || nft.ipfs_image_url === 'ipfs://undefined') {
        console.warn('Missing image URL for NFT:', nft.title);
        nft.ipfs_image_url = `ipfs://QmSUc6WbUnfhsZWcZJYfxFfhXYXS5TjY8Xu9LLrerw6Pig`;
      }

      return {
        ...nft,
        ipfs_metadata_url: nft.ipfs_metadata_url,
        ipfs_image_url: nft.ipfs_image_url
      };
    });

    console.log('Available NFTs from API:', enhancedNFTs);
    return enhancedNFTs;
  } catch (error) {
    console.error('Error fetching available NFTs:', error);
    throw error;
  }
};

// Comprehensive NFT verification
export const verifyNFTAvailability = async () => {
  try {
    // Get minted NFT URIs
    const mintedURIs = await getAllMintedNFTURIs();

    // Get available NFTs from API
    const availableNFTs = await getAvailableNFTs();

    // Compare minted URIs with available NFTs
    const availableForMinting = availableNFTs.filter(nft => {
      // Ensure we have a metadata URL
      if (!nft.ipfs_metadata_url) {
        console.warn('Skipping NFT without metadata URL:', nft);
        return false;
      }

      // Check if the NFT has already been minted
      const isAlreadyMinted = mintedURIs.includes(nft.ipfs_metadata_url);

      console.log(`NFT ${nft.properties?.page_id}: 
        Metadata URL: ${nft.ipfs_metadata_url}
        Minted Status: ${isAlreadyMinted}`
      );

      return !isAlreadyMinted;
    });

    console.log('Comprehensive NFT Verification:', {
      totalAvailableNFTs: availableNFTs.length,
      mintedNFTs: mintedURIs.length,
      availableForMinting: availableForMinting.length
    });

    return {
      totalAvailableNFTs: availableNFTs.length,
      mintedNFTs: mintedURIs.length,
      availableForMinting: availableForMinting,
      mintedURIs: mintedURIs
    };
  } catch (error) {
    console.error('Comprehensive NFT verification failed:', error);
    throw error;
  }
};

// Helper function to get IPFS hash from URL
const getIPFSHashFromUrl = (url) => {
  if (!url) return null;
  
  try {
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', '');
    } else if (url.includes('/ipfs/')) {
      return url.split('/ipfs/')[1];
    }
    return url;
  } catch (error) {
    console.error('Error extracting IPFS hash:', error);
    return null;
  }
};

// Verify metadata before minting
export const verifyMetadataBeforeMint = async (metadataUrl) => {
  try {
    console.log('Starting metadata verification for:', metadataUrl);

    if (!metadataUrl) {
      throw new Error('No metadata URL provided');
    }

    // Extract IPFS hash
    const ipfsHash = getIPFSHashFromUrl(metadataUrl);
    console.log('Extracted IPFS hash:', ipfsHash);

    if (!ipfsHash) {
      throw new Error('Failed to extract valid IPFS hash');
    }

    // Fetch metadata through proxy
    const proxyUrl = `/api/fetch-ipfs?hash=${ipfsHash}`;
    console.log('Fetching through proxy:', proxyUrl);

    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Proxy fetch failed: ${response.status}`);
    }

    let metadata;
    try {
      metadata = await response.json();
      console.log('Successfully parsed metadata:', {
        name: metadata.name,
        imageUrl: metadata.image,
        attributeCount: metadata.attributes?.length
      });
    } catch (parseError) {
      console.error('Failed to parse metadata JSON:', parseError);
      throw new Error('Invalid metadata format');
    }

    // Verify required fields
    const requiredFields = ['name', 'image', 'attributes'];
    const missingFields = requiredFields.filter(field => !metadata[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing fields in metadata:', metadata);
      throw new Error(`Missing required metadata fields: ${missingFields.join(', ')}`);
    }

    // Convert metadata image URL to IPFS protocol if needed
    if (metadata.image.startsWith('http')) {
      const imageHash = getIPFSHashFromUrl(metadata.image);
      if (imageHash) {
        metadata.image = `ipfs://${imageHash}`;
      }
    }
    
    return metadata;
  } catch (error) {
    console.error('Detailed metadata verification error:', error);
    throw new Error(`Metadata verification failed: ${error.message}`);
  }
};

// Helper function to mint a specific NFT
export const mintSpecificNFT = async (metadataUrl) => {
  try {
    console.log('Starting NFT mint process with metadata:', metadataUrl);

    if (!metadataUrl) {
      throw new Error('No metadata URL provided for minting');
    }

    // Convert to ipfs:// protocol format
    let ipfsUrl = metadataUrl;
    if (!ipfsUrl.startsWith('ipfs://')) {
      if (ipfsUrl.includes('/ipfs/')) {
        ipfsUrl = 'ipfs://' + ipfsUrl.split('/ipfs/')[1];
      } else {
        // If it's already a hash, just prepend ipfs://
        ipfsUrl = 'ipfs://' + ipfsUrl.replace(/^\/+|\/+$/g, '');
      }
    }
    
    console.log('Formatted IPFS URL for minting:', ipfsUrl);

    // Check for Web3 wallet
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Please install MetaMask or another Web3 wallet');
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();

    console.log('Minting with address:', signerAddress);

    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    // Mint the NFT using the properly formatted IPFS URL
    console.log('Calling mintNFT with:', signerAddress, ipfsUrl);
    const tx = await contract.mintNFT(signerAddress, ipfsUrl);
    console.log('Mint transaction sent:', tx.hash);

    const receipt = await tx.wait();
    console.log('Mint transaction confirmed:', receipt);

    return receipt.hash;
  } catch (error) {
    console.error('Detailed mint error:', error);
    throw error;
  }
};