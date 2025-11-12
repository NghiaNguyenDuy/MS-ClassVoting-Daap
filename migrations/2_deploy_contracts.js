// const Ballot = artifacts.require("Ballot");
// const Web3 = require('web3');

// module.exports = function(deployer) {
//   // Define candidates for voting
//   const proposalNames = [
//     Web3.utils.fromAscii("Candidate A"),
//     Web3.utils.fromAscii("Candidate B"),
//     Web3.utils.fromAscii("Candidate C"),
//     Web3.utils.fromAscii("Candidate D")
//   ];

//   // Voting duration in minutes (60 = 1 hour)
//   const votingDuration = 60;

//   deployer.deploy(Ballot, proposalNames, votingDuration).then(() => {
//     console.log("Ballot contract deployed successfully!");
//     console.log("Candidates:", proposalNames);
//     console.log("Voting duration:", votingDuration, "minutes");
//   });
// };

const Ballot = artifacts.require("Ballot");

module.exports = function(deployer, network, accounts) {
  // Define proposal names as bytes32
  const proposalNames = [
    web3.utils.asciiToHex("Proposal 1"),
    web3.utils.asciiToHex("Proposal 2"),
    web3.utils.asciiToHex("Proposal 3")
  ];
  
  // Voting duration in minutes (60 = 1 hour)
  const votingDurationInMinutes = 60;
  
  // Deploy the Ballot contract with constructor arguments
  deployer.deploy(Ballot, proposalNames, votingDurationInMinutes);
};
