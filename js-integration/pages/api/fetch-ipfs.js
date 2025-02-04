/*====================
    FETCH IPFS API
=====================*/
// pages/api/fetch-ipfs.js

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { hash } = req.query;

    if (!hash) {
        return res.status(400).json({ error: 'IPFS hash is required' });
    }

    const gateways = [
        'https://gateway.pinata.cloud/ipfs',
        'https://ipfs.io/ipfs',
        'https://dweb.link/ipfs'
    ];

    let lastError = null;

    // Try each gateway
    for (const gateway of gateways) {
        try {
            console.log(`Trying gateway: ${gateway}/${hash}`);
            
            const response = await fetch(`${gateway}/${hash}`, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'OTDNews/1.0'
                }
            });

            if (!response.ok) {
                console.log(`Gateway ${gateway} failed with status:`, response.status);
                continue;
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.log(`Invalid content type from ${gateway}:`, contentType);
                continue;
            }

            const data = await response.json();
            console.log('Successfully fetched metadata:', {
                gateway,
                hash,
                dataPreview: JSON.stringify(data).substring(0, 100) + '...'
            });

            return res.status(200).json(data);
        } catch (error) {
            console.log(`Gateway ${gateway} error:`, error.message);
            lastError = error;
        }
    }

    // If we reach here, all gateways failed
    console.error('All gateways failed. Last error:', lastError);
    return res.status(500).json({ 
        error: 'Failed to fetch from all IPFS gateways',
        message: lastError?.message || 'Unknown error',
        hash
    });
}