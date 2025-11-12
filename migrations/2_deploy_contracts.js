const Ballot = artifacts.require("Ballot");
const Web3 = require('web3');

module.exports = function(deployer) {
  // Define candidates for voting
  const proposalNames = [
    Web3.utils.fromAscii("Candidate A"),
    Web3.utils.fromAscii("Candidate B"),
    Web3.utils.fromAscii("Candidate C"),
    Web3.utils.fromAscii("Candidate D")
  ];

  // Voting duration in minutes (60 = 1 hour)
  const votingDuration = 60;

  deployer.deploy(Ballot, proposalNames, votingDuration).then(() => {
    console.log("Ballot contract deployed successfully!");
    console.log("Candidates:", proposalNames);
    console.log("Voting duration:", votingDuration, "minutes");
  });
};
