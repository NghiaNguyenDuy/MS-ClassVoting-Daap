# MS-ClassVoting-Daap

A blockchain-based classroom voting application built with Solidity (Ethereum smart contracts), React, Truffle, and Web3. This DApp lets students securely vote on proposals using the Ethereum blockchain, ensuring transparency, security, and fairness.

## Features

- Secure on-chain voting powered by a smart contract ([Ballot.sol](./contracts/Ballot.sol))
- React frontend for easy interaction with voters and results display
- MetaMask integration for real Ethereum-style wallet experience
- Ganache/Truffle development environment for easy local testing
- Full voting lifecycle: initialize, delegate, vote, and display winner

## Prerequisites

- Node.js (>= 16.x recommended)
- npm or yarn
- Truffle (`npm install -g truffle`)
- Ganache (GUI or CLI)
- MetaMask browser extension (Chrome/Firefox/Brave)

## Getting Started

### 1. Clone the Repository

<pre> ```git clone https://github.com/NghiaNguyenDuy/MS-ClassVoting-Daap.git
cd MS-ClassVoting-Daap
npm install ``` </pre>


---

### 2. Start Local Blockchain with Ganache

- **GUI:** Launch Ganache and click "Quickstart" (`http://127.0.0.1:7545`)
- **CLI:**  

<pre> ```ganache-cli -p 7545 -i 1337 ``` </pre>


---

### 3. Compile and Deploy Contracts

<pre> ```truffle compile
truffle migrate --reset ``` </pre>

- **Copy the deployed Ballot contract address** from the terminal output.

---

### 4. Update the Frontend ABI

<pre> ```cp build/contracts/Ballot.json src/contracts/Ballot.json ``` </pre>



---

### 5. Set Up the Frontend Environment Variables

- Create a `.env` file in the project root:

<pre> ```REACT_APP_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
REACT_APP_NETWORK_ID=1337 ``` </pre>


- Replace `0xYOUR_DEPLOYED_CONTRACT_ADDRESS` with the contract address from migration.

---

### 6. Connect MetaMask to Ganache Local

1. **Install MetaMask** in your browser ([MetaMask Download](https://metamask.io/download/)).
2. **Add a custom network** in MetaMask:
   - Network Name: `Ganache Local`
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337` (or `5777` if that's what Ganache shows)
   - Currency Symbol: `ETH`
3. **Import a test account** from Ganache:
   - Copy any private key from Ganache.
   - In MetaMask, Menu > "Import Account" > Paste the private key.
4. Switch MetaMask to "Ganache Local" and the imported account.

---

### 7. Start the React Frontend

<pre> ```npm start ``` </pre>


- Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

### 8. Interact With Your DApp

- Use MetaMask to connect and interact as a voter/test account.
- Grants and voting rights are set up as per migration logic.

---

### Troubleshooting

- ❌ **"Returned values aren't valid"**: Make sure ABI (`Ballot.json`) and contract address are up-to-date.
- ❌ **MetaMask not connecting**: Double-check your MetaMask network and imported account.
- ❌ **Contract functions missing**: Re-run migration, and re-copy ABI.

---

Happy building!
