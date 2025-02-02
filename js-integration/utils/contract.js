/*=======================
    CONTRACT FUNCTIONS
=======================*/
// js-integration/utils/contract.js

// utils/contract.js
import { ethers } from 'ethers';
import contractABI from '../contracts/OTDNewsNFT.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const mintNFT = async (metadataUrl) => {
  try {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask or another Web3 wallet');
    }

    // Connect to the user's wallet using newer ethers.js syntax
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Initialize the contract
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    // Call the mint function
    const tx = await contract.mintNFT(await signer.getAddress(), metadataUrl);
    const receipt = await tx.wait();

    console.log('NFT minted successfully!');
    return receipt.hash;
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
};

// Optional: Helper function to check if wallet is connected
export const checkWalletConnection = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('No Web3 wallet found');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.listAccounts();
    return accounts.length > 0;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
};