import Web3 from 'web3';

let web3Instance = null;

export const initWeb3 = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask.');
    }

    // Create Web3 instance from MetaMask provider
    web3Instance = new Web3(window.ethereum);

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    console.log('✓ Web3 initialized with account:', accounts[0]);
    // should match Ganache chain id
    return web3Instance;
  } catch (error) {
    console.error('Error initializing Web3:', error);
    throw error;
  }
};

export const getWeb3 = () => {
  if (!web3Instance) {
    throw new Error('Web3 not initialized. Call initWeb3 first.');
  }
  return web3Instance;
};

export const getAccounts = async () => {
  const web3 = getWeb3();
  return await web3.eth.getAccounts();
};
