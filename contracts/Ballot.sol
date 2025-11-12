// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/// @title Voting with delegation.
contract Ballot {
    struct Voter {
        uint weight;
        bool voted;
        address delegate;
        uint vote;
    }

    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    address public chairperson;
    mapping(address => Voter) public voters;
    Proposal[] public proposals;
    
    uint public votingStart;
    uint public votingEnd;
    bool public votingClosed;

    event VoterRegistered(address indexed voter);
    event VoteCasted(address indexed voter, uint indexed proposal);
    event VotingEnded(uint indexed winningProposal);

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

    function giveRightToVote(address voter) external {
        require(msg.sender == chairperson, "Only chairperson can give right to vote.");
        require(!voters[voter].voted, "The voter already voted.");
        require(voters[voter].weight == 0, "Voter already has voting rights");
        voters[voter].weight = 1;
        emit VoterRegistered(voter);
    }

    function delegate(address to) external {
        require(block.timestamp >= votingStart && block.timestamp <= votingEnd, "Voting is not active");
        
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

    function vote(uint proposalIndex) external {
        require(block.timestamp >= votingStart && block.timestamp <= votingEnd, "Voting is not active");
        require(proposalIndex < proposals.length, "Invalid proposal index");
        
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        
        sender.voted = true;
        sender.vote = proposalIndex;
        proposals[proposalIndex].voteCount += sender.weight;
        emit VoteCasted(msg.sender, proposalIndex);
    }

    /// Get voter information for a specific address
    function getVoterInfo(address voterAddress) external view 
        returns (uint voterWeight, bool hasVoted, address delegatedTo, uint votedProposal) 
    {
        Voter storage v = voters[voterAddress];
        return (v.weight, v.voted, v.delegate, v.vote);
    }

    /// Get all proposals at once
    function getProposals() external view 
        returns (bytes32[] memory proposalNames, uint[] memory voteCounts) 
    {
        uint count = proposals.length;
        proposalNames = new bytes32[](count);
        voteCounts = new uint[](count);
        
        for (uint i = 0; i < count; i++) {
            proposalNames[i] = proposals[i].name;
            voteCounts[i] = proposals[i].voteCount;
        }
        
        return (proposalNames, voteCounts);
    }

    function getProposalCount() external view returns (uint) {
        return proposals.length;
    }

    /// Get proposal details by index
    function getProposal(uint index) external view 
        returns (bytes32 proposalName, uint voteCount) 
    {
        require(index < proposals.length, "Invalid proposal index");
        Proposal storage p = proposals[index];
        return (p.name, p.voteCount);
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }

    function isVotingActive() external view returns (bool) {
        return block.timestamp >= votingStart && block.timestamp <= votingEnd;
    }

    function getTimeRemaining() external view returns (uint) {
        if (block.timestamp >= votingEnd) return 0;
        return votingEnd - block.timestamp;
    }
}
