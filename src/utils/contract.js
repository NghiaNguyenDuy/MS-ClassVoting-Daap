// import { getWeb3 } from './web3';
import { getWeb3, getAccounts } from './web3Utils';
import BallotABI from '../contracts/Ballot.json';

let contractInstance = null;

// Initialize contract with address
export const initContract = async (contractAddress) => {
  try {
    console.log('Initializing contract at address:', contractAddress);
    
    // Get Web3 instance
    const web3 = getWeb3();

    // Validate ABI
    if (!BallotABI) {
      throw new Error('BallotABI is undefined - JSON file not found');
    }
    if (!BallotABI.abi) {
      throw new Error('BallotABI.abi is undefined - Invalid JSON structure');
    }

    // Validate address
    if (!web3.utils.isAddress(contractAddress)) {
      throw new Error(`Invalid contract address: ${contractAddress}`);
    }

    // Create contract instance
    contractInstance = new web3.eth.Contract(
      BallotABI.abi,
      contractAddress
    );

    console.log('✓ Contract initialized successfully');
    return contractInstance;
  } catch (error) {
    console.error('Error initializing contract:', error);
    throw error;
  }
};

export const getContractInstance = () => {
  if (!contractInstance) {
    throw new Error("Contract not initialized. Call initContract first.");
  }
  return contractInstance;
};

// Export getter function to access contract
// export const getContract = () => {
//   if (!contractInstance) {
//     throw new Error('Contract not initialized. Call initContract first.');
//   }
//   return contractInstance;
// };


// Contract interaction functions
export const giveVotingRights = async (voterAddress, fromAddress) => {
  try {
    const contract = getContractInstance();
    const result = await contract.methods
      .giveRightToVote(voterAddress)
      .send({ from: fromAddress });
    console.log("Voting rights granted to", voterAddress);
    return result;
  } catch (error) {
    console.error("Error giving voting rights:", error);
    throw error;
  }
};

export const castVote = async (proposalIndex, fromAddress) => {
  try {
    const contract = getContractInstance();
    const result = await contract.methods
      .vote(proposalIndex)
      .send({ from: fromAddress });
    console.log("Vote cast for proposal", proposalIndex);
    return result;
  } catch (error) {
    console.error("Error casting vote:", error);
    throw error;
  }
};

export const getProposals = async () => {
  try {
    const contract = getContractInstance();
    const count = await contract.methods.getProposalCount().call();
    const proposals = [];

    for (let i = 0; i < count; i++) {
      const proposal = await contract.methods.getProposal(i).call();
      proposals.push({
        id: i,
        name: proposal.name,
        voteCount: proposal.voteCount
      });
    }
    return proposals;
  } catch (error) {
    console.error("Error fetching proposals:", error);
    throw error;
  }
};

// export const getVoterInfo = async (voterAddress) => {
//   try {
//     const contract = getContractInstance();
//     const voter = await contract.methods.voters(voterAddress).call();
//     return {
//       weight: voter.weight,
//       voted: voter.voted,
//       delegate: voter.delegate,
//       vote: voter.vote
//     };
//   } catch (error) {
//     console.error("Error fetching voter info:", error);
//     throw error;
//   }
// };

// FIX: Pass the voter's address to getVoterInfo
export const getVoterInfo = async () => {
  try {
    const contract = getContractInstance();
    const accounts = await getAccounts();
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts available');
    }
    
    const voterAddress = accounts[0];
    console.log('Fetching voter info for:', voterAddress);
    
    // PASS the address as a parameter
    const voterInfo = await contract.methods.getVoterInfo(voterAddress).call();
    console.log('✓ Voter info:', voterInfo);
    return voterInfo;
  } catch (error) {
    console.error('Error fetching voter info:', error);
    throw error;
  }
};


export const getWinner = async () => {
  try {
    const contract = getContractInstance();
    const winningIndex = await contract.methods.winningProposal().call();
    const winnerName = await contract.methods.winnerName().call();
    return { winningIndex, winnerName };
  } catch (error) {
    console.error("Error fetching winner:", error);
    throw error;
  }
};

export const isVotingActive = async () => {
  try {
    const contract = getContractInstance();
    return await contract.methods.isVotingActive().call();
  } catch (error) {
    console.error("Error checking voting status:", error);
    throw error;
  }
};

export const getTimeRemaining = async () => {
  try {
    const contract = getContractInstance();
    return await contract.methods.getTimeRemaining().call();
  } catch (error) {
    console.error("Error fetching time remaining:", error);
    throw error;
  }
};
