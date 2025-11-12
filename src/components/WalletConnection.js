import React, { useState, useEffect } from 'react';
import { initWeb3, getAccounts } from '../utils/web3';
import '../assets/styles/components.css';

function WalletConnection({ onConnected }) {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          onConnected(accounts[0]);
        }
      }
    } catch (err) {
      console.error("Error checking connection:", err);
    }
  };

  const connectWallet = async () => {
    try {
      setError('');
      await initWeb3();
      const accounts = await getAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        onConnected(accounts[0]);
      }
    } catch (err) {
      setError('Failed to connect wallet. Please make sure MetaMask is installed.');
      console.error("Connection error:", err);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
    setError('');
  };

  return (
    <div className="wallet-connection">
      {error && <div className="error-message">{error}</div>}
      
      {isConnected ? (
        <div className="connected-wallet">
          <span className="status-indicator" />
          <span className="account-info">
            Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
          </span>
          <button className="disconnect-btn" onClick={disconnectWallet}>
            Disconnect
          </button>
        </div>
      ) : (
        <button className="connect-btn" onClick={connectWallet}>
          Connect MetaMask Wallet
        </button>
      )}
    </div>
  );
}

export default WalletConnection;
