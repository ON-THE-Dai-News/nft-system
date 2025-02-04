/*============================
    LANDING PAGE COMPONENT
=============================*/
// components/nft/LandingPage/LandingPage.js

'use client';

import { useState, useEffect } from 'react';
import { verifyNFTAvailability, mintSpecificNFT, verifyMetadataBeforeMint } from '@/utils/contract';
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
    const [nftVerification, setNftVerification] = useState(null);

    useEffect(() => {
        fetchAvailableNFTs();
        verifyNFTAvailability();
    }, []);

    const fetchAvailableNFTs = async () => {
        setFetchError('');
        setIsLoading(true);
        try {
            const response = await fetch('/api/available-nfts');
            const data = await response.json();

            if (!response.ok) {
                // Log detailed error information
                console.error('API Response Error:', data);
                throw new Error(data.message || data.error || 'Failed to fetch NFTs');
            }

            // Log the full NFT data structure
            console.log('Fetched NFT Data:', {
                count: data.nfts?.length,
                firstNFT: data.nfts?.[0],
                timestamp: data.timestamp
            });

            setAvailableNFTs(data.nfts || []);
        } catch (error) {
            console.error('Complete Fetch Error:', error);
            setFetchError(error.message || 'Failed to load available NFTs');
            setAvailableNFTs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const performNFTVerification = async () => {
        try {
            const verification = await verifyNFTAvailability();
            setNftVerification(verification);
        } catch (error) {
            console.error('NFT Verification Error:', error);
            setFetchError(error.message || 'Failed to verify NFT availability');
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
            // Ensure Web3 wallet is available
            if (typeof window === 'undefined' || !window.ethereum) {
                throw new Error('Please install MetaMask to mint NFTs');
            }
    
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
    
            // Verify NFT availability
            const verification = await verifyNFTAvailability();
            console.log('NFT Verification:', verification);
    
            if (!verification.availableForMinting || verification.availableForMinting.length === 0) {
                throw new Error('No NFTs available for minting');
            }
    
            // Select the first available NFT
            const nftToMint = verification.availableForMinting[0];
            console.log('Selected NFT for minting:', nftToMint);
    
            if (!nftToMint.ipfs_metadata_url) {
                throw new Error('Selected NFT missing metadata URL');
            }
    
            console.log('NFT to mint:', {
                ipfs_metadata_url: nftToMint.ipfs_metadata_url,
                ipfs_image_url: nftToMint.ipfs_image_url,
                properties: nftToMint.properties
            });
    
            // Verify metadata before minting
            const verifiedMetadata = await verifyMetadataBeforeMint(nftToMint.ipfs_metadata_url);
            console.log('Verified metadata:', verifiedMetadata);
    
            // Mint the NFT
            const txHash = await mintSpecificNFT(nftToMint.ipfs_metadata_url);
            console.log('Mint transaction hash:', txHash);
    
            setMintStatus({
                isLoading: false,
                error: '',
                success: 'NFT minted successfully! Metadata verified.',
                txHash
            });
    
            // Refresh available NFTs and verification
            await fetchAvailableNFTs();
            await performNFTVerification();
        } catch (error) {
            console.error('Detailed minting error:', error);
            setMintStatus({
                isLoading: false,
                error: `Minting failed: ${error.message}`,
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

                {/* NFT Verification Information */}
                {nftVerification && (
                    <div className="nft-verification-info">
                        <p>Total Available NFTs: {nftVerification.totalAvailableNFTs}</p>
                        <p>Minted NFTs: {nftVerification.mintedNFTs}</p>
                        <p>NFTs Available for Minting: {nftVerification.availableForMinting.length}</p>
                    </div>
                )}

                <h2>== Currently Available for Minting ==</h2>
                {isLoading ? (
                    <div className="loading-state">Loading available NFTs...</div>
                ) : fetchError ? (
                    <div className="error-state">
                        {fetchError}
                        <button onClick={() => {
                            fetchAvailableNFTs();
                            performNFTVerification();
                        }} className="retry-button">
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
                        disabled={
                            mintStatus.isLoading ||
                            availableNFTs.length === 0 ||
                            (nftVerification && nftVerification.availableForMinting.length === 0)
                        }
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