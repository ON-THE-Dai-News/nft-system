/*========================
    AVAILABLE NFTS API
========================*/
// pages/api/available-nfts.js

import { readFileSync } from 'fs';
import { resolve } from 'path';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Read from your activeNewsInfo.json
        const filePath = resolve('src/config/activeNewsInfo.json');
        const fileData = readFileSync(filePath, 'utf-8');
        const newsData = JSON.parse(fileData);

        // Filter for NFTs that haven't been minted yet
        const availableNFTs = newsData.map(item => ({
            title: item.title,
            metadataUrl: `ipfs://${item.metadataUrl.split('/').pop()}`, // Convert gateway URL to IPFS URL
            description: item.description
        }));

        res.status(200).json({ nfts: availableNFTs });
    } catch (error) {
        console.error('Error fetching available NFTs:', error);
        res.status(500).json({ error: 'Failed to fetch available NFTs' });
    }
}