import Web3 from 'web3';

export const formatAddress = (address) => {
  if (!address) return 'N/A';
  return address.substring(0, 6) + '...' + address.substring(address.length - 4);
};

export const convertBytes32ToAscii = (bytes32String) => {
  if (!bytes32String) return 'N/A';
  return Web3.utils.toAscii(bytes32String).replace(/\0/g, '');
};

export const convertAsciiToBytes32 = (string) => {
  return Web3.utils.fromAscii(string);
};

export const formatVoteCount = (count) => {
  return parseInt(count, 10);
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const handleError = (error) => {
  if (error.message.includes('User denied')) {
    return 'Transaction rejected by user';
  }
  if (error.message.includes('Already voted')) {
    return 'You have already voted';
  }
  if (error.message.includes('no right to vote')) {
    return 'You do not have voting rights';
  }
  return error.message || 'An error occurred';
};

export const validateAddress = (address) => {
  return Web3.utils.isAddress(address);
};
