"use client";

import React, { useState, useEffect } from 'react';
import { Wallet, AlertCircle } from 'lucide-react';

const WalletConnect = () => {
  const [account, setAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        // Handle account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        
        // Check if already connected
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });
          handleAccountsChanged(accounts);
        } catch (err) {
          console.error('Error checking wallet status:', err);
        }
      }
    };

    checkWallet();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setError('');
    } else {
      setAccount('');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      handleAccountsChanged(accounts);
    } catch (err) {
      let errorMessage = 'Failed to connect wallet. Please try again.';
      
      if (err.code === 4001) {
        errorMessage = 'Please approve the connection request in your wallet.';
      } else if (err.code === -32002) {
        errorMessage = 'Connection request already pending. Please check your wallet.';
      }
      
      setError(errorMessage);
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="wallet-connect">
      {error && (
        <div className="wallet-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {account ? (
        <div className="wallet-info">
          <Wallet size={16} />
          <span className="wallet-address">
            {`${account.slice(0, 6)}...${account.slice(-4)}`}
          </span>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="connect-button"
        >
          <Wallet size={16} />
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      )}
    </div>
  );
};

export default WalletConnect;