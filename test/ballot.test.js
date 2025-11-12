const Ballot = artifacts.require("Ballot");
const Web3 = require('web3');

contract("Ballot", (accounts) => {
  let ballotInstance;
  const chairperson = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];
  const voter3 = accounts[3];

  const proposalNames = [
    Web3.utils.fromAscii("Candidate A"),
    Web3.utils.fromAscii("Candidate B"),
    Web3.utils.fromAscii("Candidate C")
  ];

  beforeEach(async () => {
    ballotInstance = await Ballot.new(proposalNames, 60);
  });

  describe("Ballot Deployment", () => {
    it("should deploy with correct chairperson", async () => {
      const chair = await ballotInstance.chairperson();
      assert.equal(chair, chairperson, "Chairperson address mismatch");
    });

    it("should have correct number of proposals", async () => {
      const count = await ballotInstance.getProposalCount();
      assert.equal(count, proposalNames.length, "Proposal count mismatch");
    });

    it("should initialize voting as active", async () => {
      const isActive = await ballotInstance.isVotingActive();
      assert.equal(isActive, true, "Voting should be active");
    });
  });

  describe("Voter Registration", () => {
    it("should give right to vote", async () => {
      await ballotInstance.giveRightToVote(voter1, { from: chairperson });
      const voter = await ballotInstance.voters(voter1);
      assert.equal(voter.weight, 1, "Voter weight should be 1");
    });

    it("should prevent non-chairperson from giving rights", async () => {
      try {
        await ballotInstance.giveRightToVote(voter2, { from: voter1 });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "Only chairperson");
      }
    });

    it("should prevent giving rights to same voter twice", async () => {
      await ballotInstance.giveRightToVote(voter1, { from: chairperson });
      try {
        await ballotInstance.giveRightToVote(voter1, { from: chairperson });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "already has voting rights");
      }
    });
  });

  describe("Voting Process", () => {
    beforeEach(async () => {
      await ballotInstance.giveRightToVote(voter1, { from: chairperson });
      await ballotInstance.giveRightToVote(voter2, { from: chairperson });
    });

    it("should allow voting for valid proposal", async () => {
      await ballotInstance.vote(0, { from: voter1 });
      const proposal = await ballotInstance.getProposal(0);
      assert.equal(proposal.voteCount, 1, "Vote count should be 1");
    });

    it("should prevent voting without rights", async () => {
      try {
        await ballotInstance.vote(0, { from: voter3 });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "no right to vote");
      }
    });

    it("should prevent double voting", async () => {
      await ballotInstance.vote(0, { from: voter1 });
      try {
        await ballotInstance.vote(1, { from: voter1 });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "Already voted");
      }
    });

    it("should reject invalid proposal index", async () => {
      try {
        await ballotInstance.vote(99, { from: voter1 });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "Invalid proposal");
      }
    });
  });

  describe("Results", () => {
    beforeEach(async () => {
      await ballotInstance.giveRightToVote(voter1, { from: chairperson });
      await ballotInstance.giveRightToVote(voter2, { from: chairperson });
      await ballotInstance.giveRightToVote(voter3, { from: chairperson });

      await ballotInstance.vote(0, { from: voter1 });
      await ballotInstance.vote(0, { from: voter2 });
      await ballotInstance.vote(1, { from: voter3 });
    });

    it("should calculate winning proposal correctly", async () => {
      const winning = await ballotInstance.winningProposal();
      assert.equal(winning, 0, "Candidate A should be winning");
    });

    it("should return winner name", async () => {
      const winnerBytes = await ballotInstance.winnerName();
      const winner = Web3.utils.toAscii(winnerBytes);
      assert.equal(winner.trim(), "Candidate A", "Winner should be Candidate A");
    });
  });
});
