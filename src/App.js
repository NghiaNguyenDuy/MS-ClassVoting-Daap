import React, { useState, useEffect } from 'react';
import { initWeb3, getWeb3 } from './utils/web3Utils';
import WalletConnection from './components/WalletConnection';
import VotingCard from './components/VotingCard';
import ResultsDisplay from './components/ResultsDisplay';
import { initContract, getProposals, getVoterInfo } from './utils/contract';
import { convertBytes32ToAscii } from './utils/helpers';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [proposals, setProposals] = useState([]);
  const [voterInfo, setVoterInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [contractInitialized, setContractInitialized] = useState(false);

  // Contract address - REPLACE WITH YOUR DEPLOYED CONTRACT ADDRESS
  const CONTRACT_ADDRESS = '0x44B4cBabdFD786bE9b2CEE11149c65543D155817';

  // useEffect(() => {
  //   initializeApp();
  // }, []);


  // useEffect(() => {
  //   const initializeApp = async () => {
  //     try {
  //       if (!process.env.REACT_APP_CONTRACT_ADDRESS) {
  //         console.error('Contract address not set in .env');
  //         return;
  //       }
        
  //       await initContract(process.env.REACT_APP_CONTRACT_ADDRESS);
        
  //       const voterInfo = await getVoterInfo();
  //       console.log('Voter info:', voterInfo);
        
  //       const proposals = await getProposals();
  //       setProposals(proposals);
  //     } catch (error) {
  //       console.error('Error initializing app:', error);
  //     }
  //   };

  //   initializeApp();
  // }, []);
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        
        // Step 1: Initialize Web3 with MetaMask
        console.log('Step 1: Initializing Web3...');
        await initWeb3();
        
        // Step 2: Initialize Contract
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        if (!contractAddress) {
          throw new Error('REACT_APP_CONTRACT_ADDRESS not set in .env');
        }
        
        console.log('Step 2: Initializing contract at', contractAddress);
        await initContract(contractAddress);
        
        // Step 3: Fetch voter info
        console.log('Step 3: Fetching voter info...');
        const voter = await getVoterInfo();
        setVoterInfo(voter);
        
        // Step 4: Fetch proposals
        console.log('Step 4: Fetching proposals...');
        const props = await getProposals();
        setProposals(props);
        
        setError(null);
      } catch (err) {
        console.error('Error during initialization:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      await initContract(CONTRACT_ADDRESS);
      setContractInitialized(true);
      await loadProposals();
    } catch (err) {
      setError('Failed to initialize contract. Please check the contract address.');
      console.error("Initialization error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadProposals = async () => {
    try {
      const props = await getProposals();
      setProposals(props);
    } catch (err) {
      console.error("Error loading proposals:", err);
      setError('Failed to load proposals');
    }
  };

  const handleWalletConnected = async (connectedAccount) => {
    setAccount(connectedAccount);
    await loadVoterInfo(connectedAccount);
  };

  const loadVoterInfo = async (voterAddress) => {
    try {
      const info = await getVoterInfo(voterAddress);
      setVoterInfo(info);
    } catch (err) {
      console.error("Error loading voter info:", err);
    }
  };

  const handleVoteSuccess = async () => {
    await loadProposals();
    if (account) {
      await loadVoterInfo(account);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading voting application...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Blockchain Voting Application</h1>
        <WalletConnection onConnected={handleWalletConnected} />
      </header>

      {error && <div className="error-message">{error}</div>}

      <main className="main-content">
        {contractInitialized && proposals.length > 0 ? (
          <div className="content-grid">
            <section className="voting-section">
              <h2>Vote for Your Candidate</h2>
              <div className="voting-cards">
                {proposals.map((proposal) => (
                  <VotingCard
                    key={proposal.id}
                    proposal={proposal}
                    userAccount={account}
                    onVoteSuccess={handleVoteSuccess}
                  />
                ))}
              </div>
            </section>

            <section className="results-section">
              <ResultsDisplay proposals={proposals} />
            </section>
          </div>
        ) : (
          <div className="message">
            Loading voting options... Please wait or check contract address.
          </div>
        )}

        {voterInfo && (
          <section className="voter-info">
            <h3>Your Voting Status</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Voting Rights:</span>
                <span className="value">{voterInfo.weight > 0 ? 'Yes' : 'No'}</span>
              </div>
              <div className="info-item">
                <span className="label">Already Voted:</span>
                <span className="value">{voterInfo.voted ? 'Yes' : 'No'}</span>
              </div>
              {voterInfo.delegate !== '0x0000000000000000000000000000000000000000' && (
                <div className="info-item">
                  <span className="label">Delegated To:</span>
                  <span className="value">
                    {voterInfo.delegate.substring(0, 6)}...
                  </span>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
