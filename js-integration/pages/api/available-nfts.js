/*========================
    AVAILABLE NFTS API
========================*/
// pages/api/available-nfts.js

import { getAllIPFSUrls } from '../../utils/ipfsStorage';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Fetch news data
        const today = new Date();
        const date = today.toLocaleDateString('en-CA');
        const backendUrl = `http://localhost:5000/backups/activeNewsInfo_${date}.json`;
        
        const response = await fetch(backendUrl);
        let newsData;
        
        if (!response.ok) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayDate = yesterday.toLocaleDateString('en-CA');
            const fallbackUrl = `http://localhost:5000/backups/activeNewsInfo_${yesterdayDate}.json`;
            
            const fallbackResponse = await fetch(fallbackUrl);
            if (!fallbackResponse.ok) {
                throw new Error('Failed to fetch NFTs');
            }
            newsData = await fallbackResponse.json();
        } else {
            newsData = await response.json();
        }

        // Get stored IPFS URLs
        const ipfsData = await getAllIPFSUrls();

        // Combine news data with IPFS URLs
        const enhancedNFTs = newsData.map(item => {
            const storedData = ipfsData[item.page_id];
            
            if (!storedData) {
                console.warn(`No IPFS data found for page_id ${item.page_id}`);
            }

            return {
                ...item,
                ipfs_metadata_url: storedData?.ipfs_metadata_url || null,
                ipfs_image_url: storedData?.ipfs_image_url || null,
                properties: {
                    page_id: item.page_id,
                    date: item.date,
                    creator: item.creator
                }
            };
        });

        return res.status(200).json({ 
            nfts: enhancedNFTs,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in available-nfts:', error);
        res.status(500).json({ 
            error: 'Failed to fetch NFTs',
            message: error.message
        });
    }
}