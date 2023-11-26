export const CHAINIDS = {
  AIOZ: '4102',
  GOERLI: '5',
  MUMBAI: '80001',
}
export const CHAINS = [
  {
    chainId: CHAINIDS.AIOZ,
    chainIdHex: '0x1006',
    chainName: 'AIOZ Network Testnet',
    rpcUrl: 'https://eth-ds.testnet.aioz.network',
    CurrencySymbol: 'AIOZ',
    blockExplorerUrl: 'https://testnet.explorer.aioz.network',
    nativeCurrency: {
      name: 'AIOZ',
      symbol: 'AIOZ',
      decimals: 18,
    },
  },
  {
    chainId: CHAINIDS.GOERLI,
    chainIdHex: '0x5',
    chainName: 'Goerli',
    rpcUrl: 'https://rpc.ankr.com/eth_goerli',
    CurrencySymbol: 'Goerli ETH',
    blockExplorerUrl: 'https://goerli.etherscan.io',
    nativeCurrency: {
      name: 'Goerli ETH',
      symbol: 'Goerli ETH',
      decimals: 18,
    },
  },
  {
    chainId: CHAINIDS.MUMBAI,
    chainIdHex: '0x13881',
    chainName: 'Mumbai',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    CurrencySymbol: 'MATIC',
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
]
