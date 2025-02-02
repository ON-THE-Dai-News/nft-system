'use client';

/*============================
    LANDING PAGE COMPONENT
=============================*/
// components/nft/LandingPage/LandingPage.js

import { useState } from 'react';
import { ethers } from 'ethers';
import { mintNFT } from '@/utils/contract';
import './LandingPage.scss';

const LandingPage = () => {
    const [mintStatus, setMintStatus] = useState({
        isLoading: false,
        error: '',
        success: '',
        txHash: ''
    });

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
                <h1>OTD News NFTs</h1>
                <p className="subtitle">Collect Breaking News as NFTs</p>

                <div className="mint-section">
                    <button
                        className={`mint-button ${mintStatus.isLoading ? 'loading' : ''}`}
                        onClick={handleMint}
                        disabled={mintStatus.isLoading}
                    >
                        {mintStatus.isLoading ? 'Minting...' : 'Mint NFT'}
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
                                href={`https://etherscan.io/tx/${mintStatus.txHash}`}
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