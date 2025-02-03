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
        
        const backendUrl = `http://localhost:5000/backups/activeNewsInfo_${date}.json`;
        console.log('Attempting to fetch from:', backendUrl);

        const response = await fetch(backendUrl);
        
        if (!response.ok) {
            // If file doesn't exist for today, try yesterday
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayDate = yesterday.toISOString().split('T')[0];
            
            const fallbackUrl = `http://localhost:5000/backups/activeNewsInfo_${yesterdayDate}.json`;
            console.log('Trying fallback URL:', fallbackUrl);
            
            const fallbackResponse = await fetch(fallbackUrl);
            
            if (!fallbackResponse.ok) {
                throw new Error(`Failed to fetch NFTs. Status: ${response.status}. 
                    Fallback status: ${fallbackResponse.status}`);
            }
            
            const fallbackData = await fallbackResponse.json();
            return res.status(200).json({ 
                nfts: fallbackData,
                timestamp: new Date().toISOString(),
                note: 'Using data from previous day'
            });
        }

        const newsData = await response.json();
        return res.status(200).json({ 
            nfts: newsData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching available NFTs:', error);
        res.status(500).json({ 
            error: 'Failed to fetch available NFTs',
            message: error.message,
            details: 'Please ensure the backend server is running on port 5000'
        });
    }
}