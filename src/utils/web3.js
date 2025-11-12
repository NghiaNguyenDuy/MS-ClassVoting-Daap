import Web3 from 'web3';

let web3;

export const initWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Web3 initialized successfully");
      return web3;
    } catch (error) {
      console.error("User denied account access");
      throw error;
    }
  } else {
    console.error("MetaMask not detected");
    alert("Please install MetaMask!");
    throw new Error("MetaMask not found");
  }
};

export const getWeb3 = () => {
  if (!web3) {
    web3 = new Web3(window.ethereum || 'http://localhost:7545');
  }
  return web3;
};

export const getAccounts = async () => {
  const web3Instance = getWeb3();
  return await web3Instance.eth.getAccounts();
};

export const getNetworkId = async () => {
  const web3Instance = getWeb3();
  return await web3Instance.eth.net.getId();
};

export const convertToAscii = (bytes32String) => {
  return Web3.utils.toAscii(bytes32String).replace(/\0/g, '');
};

export const convertToBytes32 = (string) => {
  return Web3.utils.fromAscii(string);
};
