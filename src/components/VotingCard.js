import React, { useState } from 'react';
import { castVote } from '../utils/contract';
import { convertBytes32ToAscii, handleError, formatVoteCount } from '../utils/helpers';
import '../assets/styles/components.css';

function VotingCard({ proposal, userAccount, onVoteSuccess }) {
  const [isVoting, setIsVoting] = useState(false);
  const [message, setMessage] = useState('');

  const handleVote = async () => {
    if (!userAccount) {
      setMessage('Please connect your wallet first');
      return;
    }

    try {
      setIsVoting(true);
      setMessage('Processing your vote...');
      
      await castVote(proposal.id, userAccount);
      
      setMessage('Vote cast successfully!');
      onVoteSuccess();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMsg = handleError(error);
      setMessage('Error: ' + errorMsg);
    } finally {
      setIsVoting(false);
    }
  };

  const candidateName = convertBytes32ToAscii(proposal.name);

  return (
    <div className="voting-card">
      <div className="card-content">
        <h3 className="candidate-name">{candidateName}</h3>
        <div className="vote-stats">
          <p className="vote-count">
            Votes: <span className="count">{formatVoteCount(proposal.voteCount)}</span>
          </p>
          <div className="vote-bar">
            <div 
              className="vote-progress" 
              style={{ width: `${Math.min((proposal.voteCount * 10), 100)}%` }}
            />
          </div>
        </div>
      </div>
      
      <button
        className="vote-button"
        onClick={handleVote}
        disabled={isVoting}
      >
        {isVoting ? 'Voting...' : 'Vote'}
      </button>
      
      {message && <div className="vote-message">{message}</div>}
    </div>
  );
}

export default VotingCard;
