// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/// @title Voting with delegation.
contract Ballot {
    // Voter structure
    struct Voter {
        uint weight;        // weight is accumulated by delegation
        bool voted;         // if true, that person already voted
        address delegate;   // person delegated to
        uint vote;          // index of the voted proposal
    }

    // Proposal structure
    struct Proposal {
        bytes32 name;       // short name (up to 32 bytes)
        uint voteCount;     // number of accumulated votes
    }

    address public chairperson;
    mapping(address => Voter) public voters;
    Proposal[] public proposals;
    
    uint public votingStart;
    uint public votingEnd;
    bool public votingClosed;

    // Events
    event VoterRegistered(address indexed voter);
    event VoteCasted(address indexed voter, uint indexed proposal);
    event VotingEnded(uint indexed winningProposal);

    /// Create a new ballot to choose one of `proposalNames`.
    constructor(bytes32[] memory proposalNames, uint durationInMinutes) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (durationInMinutes * 1 minutes);
        votingClosed = false;

        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    /// Give `voter` the right to vote on this ballot.
    function giveRightToVote(address voter) external {
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(
            !voters[voter].voted,
            "The voter already voted."
        );
        require(voters[voter].weight == 0, "Voter already has voting rights");
        voters[voter].weight = 1;
        emit VoterRegistered(voter);
    }

    /// Delegate your vote to the voter `to`.
    function delegate(address to) external {
        require(
            block.timestamp >= votingStart && block.timestamp <= votingEnd,
            "Voting is not active"
        );
        
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "You have no right to vote");
        require(!sender.voted, "You already voted.");
        require(to != msg.sender, "Self-delegation is disallowed.");

        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;
            require(to != msg.sender, "Found loop in delegation.");
        }

        Voter storage delegate_ = voters[to];
        require(delegate_.weight >= 1);
        
        sender.voted = true;
        sender.delegate = to;

        if (delegate_.voted) {
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            delegate_.weight += sender.weight;
        }
    }

    /// Give your vote to proposal `proposals[proposal].name`.
    function vote(uint proposal) external {
        require(
            block.timestamp >= votingStart && block.timestamp <= votingEnd,
            "Voting is not active"
        );
        require(proposal < proposals.length, "Invalid proposal index");
        
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        
        sender.voted = true;
        sender.vote = proposal;
        proposals[proposal].voteCount += sender.weight;
        emit VoteCasted(msg.sender, proposal);
    }

    /// Returns the number of proposals.
    function getProposalCount() external view returns (uint) {
        return proposals.length;
    }

    /// Get proposal details.
    function getProposal(uint index) external view 
        returns (bytes32 name, uint voteCount) 
    {
        require(index < proposals.length, "Invalid proposal index");
        Proposal storage p = proposals[index];
        return (p.name, p.voteCount);
    }

    /// Computes the winning proposal.
    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /// Returns the name of the winner.
    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }

    /// Check if voting period is active.
    function isVotingActive() external view returns (bool) {
        return block.timestamp >= votingStart && block.timestamp <= votingEnd;
    }

    /// Get time remaining in voting.
    function getTimeRemaining() external view returns (uint) {
        if (block.timestamp >= votingEnd) return 0;
        return votingEnd - block.timestamp;
    }
}
