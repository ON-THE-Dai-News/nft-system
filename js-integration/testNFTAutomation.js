// testNFTAutomation.js

import { automateNFTCreation } from './automation/nftAutomation.js';

const testNFTAutomation = async () => {
  try {
    const result = await automateNFTCreation();
    console.log("NFT automation test completed:", result);
  } catch (error) {
    console.error("Error during NFT automation test:", error);
  }
};

testNFTAutomation();