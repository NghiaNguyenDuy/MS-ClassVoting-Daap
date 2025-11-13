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

// const Ballot = artifacts.require("Ballot");

// module.exports = async function(deployer, network, accounts) {
//   // Define proposal names as bytes32
//   const proposalNames = [
//     web3.utils.asciiToHex("Proposal 1"),
//     web3.utils.asciiToHex("Proposal 2"),
//     web3.utils.asciiToHex("Proposal 3")
//   ];
  
//   // Voting duration in minutes (60 = 1 hour)
//   const votingDurationInMinutes = 60;
  
//   // Deploy the Ballot contract
//   await deployer.deploy(Ballot, proposalNames, votingDurationInMinutes);
  
//   // Get the deployed contract instance
//   const ballotInstance = await Ballot.deployed();
  
//   console.log("Ballot deployed at:", ballotInstance.address);
  
//   // Grant voting rights to accounts (with error handling)
//   try {
//     console.log("Granting voting rights to chairperson:", accounts[0]);
//     await ballotInstance.giveRightToVote(accounts[0]);
//     console.log("✓ Chairperson voting rights granted");
//   } catch (error) {
//     console.log("Chairperson already has voting rights or error:", error.message);
//   }
  
//   // Grant voting rights to test accounts
//   for (let i = 1; i <= Math.min(2, accounts.length - 1); i++) {
//     try {
//       console.log("Granting voting rights to account:", accounts[i]);
//       await ballotInstance.giveRightToVote(accounts[i]);
//       console.log(`✓ Account ${i} voting rights granted`);
//     } catch (error) {
//       console.log(`Account ${i} already has voting rights or error:`, error.message);
//     }
//   }
  
//   console.log("✓ Ballot deployment complete");
// };
