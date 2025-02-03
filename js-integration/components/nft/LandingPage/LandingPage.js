/*============================
    LANDING PAGE COMPONENT
=============================*/
// components/nft/LandingPage/LandingPage.js

'use client';

import { useState, useEffect } from 'react';
import { mintNFT } from '@/utils/contract';
import NFTCard from '../NFTCard/NFTCard';
import './LandingPage.scss';

const LandingPage = () => {
    const [availableNFTs, setAvailableNFTs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [mintStatus, setMintStatus] = useState({
        isLoading: false,
        error: '',
        success: '',
        txHash: ''
    });

    useEffect(() => {
        fetchAvailableNFTs();
    }, []);

    const fetchAvailableNFTs = async () => {
        setFetchError('');
        setIsLoading(true);
        try {
            const response = await fetch('/api/available-nfts');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch NFTs');
            }

            setAvailableNFTs(data.nfts || []);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
            setFetchError(error.message || 'Failed to load available NFTs');
            setAvailableNFTs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMint = async () => {
        setMintStatus({
            isLoading: true,
            error: '',
            success: '',
            txHash: ''
        });

        try {
            if (!window.ethereum) {
                throw new Error('Please install MetaMask to mint NFTs');
            }

            // For testing, use a specific metadata URL
            const metadataUrl = "ipfs://QmWBvbdRjqFywjBZpJ1UNg88DLt4JYDFut6dyLnUvBW7zZ";

            // Mint the NFT
            const txHash = await mintNFT(metadataUrl);

            setMintStatus({
                isLoading: false,
                error: '',
                success: 'NFT minted successfully!',
                txHash
            });
        } catch (error) {
            setMintStatus({
                isLoading: false,
                error: error.message,
                success: '',
                txHash: ''
            });
        }
    };

    return (
        <div className="landing-page">
            <div className="hero-section">
                <h1>OTDNews NFTs</h1>
                <p className="subtitle">COLLECT BREAKING NEWS AS NFTs</p>

                <h2>== Currently Available for Minting ==</h2>
                {isLoading ? (
                    <div className="loading-state">Loading available NFTs...</div>
                ) : fetchError ? (
                    <div className="error-state">
                        {fetchError}
                        <button onClick={fetchAvailableNFTs} className="retry-button">
                            Retry
                        </button>
                    </div>
                ) : availableNFTs.length === 0 ? (
                    <div className="no-nfts-state">
                        🛸 No NFTs currently available for minting
                    </div>
                ) : (
                    <div className="nft-grid">
                        {availableNFTs.map((nft, index) => (
                            <NFTCard key={nft.page_id || index} nft={nft} />
                        ))}
                    </div>
                )}

                <div className="mint-section">
                    <button
                        className={`mint-button ${mintStatus.isLoading ? 'loading' : ''}`}
                        onClick={handleMint}
                        disabled={mintStatus.isLoading || availableNFTs.length === 0}
                    >
                        {mintStatus.isLoading ? 'Minting...' : 'Mint Random NFT'}
                    </button>

                    {mintStatus.error && (
                        <div className="status-message error">
                            {mintStatus.error}
                        </div>
                    )}

                    {mintStatus.success && (
                        <div className="status-message success">
                            <p>{mintStatus.success}</p>
                            <a
                                href={`https://sepolia.explorer.mode.network/tx/${mintStatus.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tx-link"
                            >
                                View Transaction
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;