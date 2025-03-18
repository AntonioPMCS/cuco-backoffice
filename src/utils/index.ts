export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2)
  return balance
}

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex)
  return chainIdNum
}

export const formatChainAsString = (chainIdHex: string) => {
  let chainIdNumber:number = formatChainAsNum(chainIdHex);
  switch (chainIdNumber) {
    case 11155111:
      return "Sepolia";
    case 31337:
      return "Anvil Localnet";
    default:
      return "Unknown";
  }
}

export const formatAddress = (addr: string) => {
  const upperAfterLastTwo = addr.slice(0, 2) + addr.slice(2)
  return `${upperAfterLastTwo.substring(0, 5)}...${upperAfterLastTwo.substring(39)}`
}

export const truncateMiddle = (text: string, startLength = 6, endLength = 6) => {
  if (text.length <= startLength + endLength) return text; // Don't truncate if not needed
  return `${text.slice(0, startLength)}...${text.slice(-endLength)}`;
};
