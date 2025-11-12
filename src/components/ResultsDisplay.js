import React, { useState, useEffect } from 'react';
import { getWinner, getTimeRemaining } from '../utils/contract';
import { convertBytes32ToAscii, formatTime } from '../utils/helpers';
import '../assets/styles/components.css';

function ResultsDisplay({ proposals }) {
  const [winner, setWinner] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchResults = async () => {
    try {
      const winnerData = await getWinner();
      const time = await getTimeRemaining();
      
      setWinner({
        index: winnerData.winningIndex,
        name: convertBytes32ToAscii(winnerData.winnerName)
      });
      setTimeRemaining(time);
      setError('');
    } catch (err) {
      console.error("Error fetching results:", err);
      setError('Could not fetch results');
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const totalVotes = proposals.reduce((sum, p) => sum + parseInt(p.voteCount, 10), 0);

  return (
    <div className="results-display">
      <h2>Live Results</h2>
      
      <div className="time-remaining">
        <p>Time Remaining: <span>{formatTime(timeRemaining)}</span></p>
      </div>

      <div className="results-list">
        {proposals.map((proposal) => {
          const percentage = totalVotes > 0 
            ? ((parseInt(proposal.voteCount, 10) / totalVotes) * 100).toFixed(1)
            : 0;
          
          const candidateName = convertBytes32ToAscii(proposal.name);
          const isWinner = winner && winner.index === proposal.id;

          return (
            <div key={proposal.id} className={`result-item ${isWinner ? 'winner' : ''}`}>
              <div className="result-info">
                <span className="candidate-name">{candidateName}</span>
                <span className="vote-info">
                  {proposal.voteCount} votes ({percentage}%)
                </span>
              </div>
              <div className="result-bar">
                <div 
                  className="result-progress"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {winner && (
        <div className="winner-announcement">
          <h3>Current Leader: {winner.name}</h3>
        </div>
      )}
    </div>
  );
}

export default ResultsDisplay;
