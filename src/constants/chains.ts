export const CHAIN_IDS = {
  AIOZ: 4102,
  GOERLI: 5,
  MUMBAI: 80001,
}
export const DEFAULT_CHAIN_ID = CHAIN_IDS.GOERLI
export const DEFAULT_WRAP_TOKEN_SYMBOL = 'WUIT'
export const CHAINS = [
  {
    chainId: CHAIN_IDS.AIOZ,
    chainIdHex: '0x1006',
    chainName: 'AIOZ Network Testnet',
    rpcUrl: 'https://eth-ds.testnet.aioz.network',
    currencySymbol: 'AIOZ',
    blockExplorerUrl: 'https://testnet.explorer.aioz.network',
    nativeCurrency: {
      name: 'AIOZ',
      symbol: 'AIOZ',
      decimals: 18,
    },
  },
  {
    chainId: CHAIN_IDS.GOERLI,
    chainIdHex: '0x5',
    chainName: 'Goerli',
    rpcUrl: 'https://rpc.ankr.com/eth_goerli',
    currencySymbol: 'Goerli ETH',
    blockExplorerUrl: 'https://goerli.etherscan.io',
    nativeCurrency: {
      name: 'Goerli ETH',
      symbol: 'Goerli ETH',
      decimals: 18,
    },
  },
  {
    chainId: CHAIN_IDS.MUMBAI,
    chainIdHex: '0x13881',
    chainName: 'Mumbai',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    currencySymbol: 'MATIC',
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
]
