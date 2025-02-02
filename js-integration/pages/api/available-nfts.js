/*========================
    AVAILABLE NFTS API
========================*/
// pages/api/available-nfts.js

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get current date in the format you need
        const today = new Date();
        const date = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Fetch from your local backend
        const response = await fetch(`http://localhost:5000/backups/activeNewsInfo_${date}.json`);
        
        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        const newsData = await response.json();

        // Return the NFTs data
        res.status(200).json({ 
            nfts: newsData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching available NFTs:', error);
        res.status(500).json({ 
            error: 'Failed to fetch available NFTs',
            message: error.message
        });
    }
}