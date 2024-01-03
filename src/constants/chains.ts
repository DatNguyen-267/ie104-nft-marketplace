export const CHAIN_IDS = {
  AIOZ: 4102,
  GOERLI: 5,
  SEPOLIA: 11155111,
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
    rpcUrl: 'https://goerli.blockpi.network/v1/rpc/public',
    currencySymbol: 'Goerli ETH',
    blockExplorerUrl: 'https://goerli.etherscan.io',
    nativeCurrency: {
      name: 'Goerli ETH',
      symbol: 'Goerli ETH',
      decimals: 18,
    },
  },
  {
    chainId: CHAIN_IDS.SEPOLIA,
    chainIdHex: '0xaa36a7',
    chainName: 'SEPOLIA',
    rpcUrl: 'https://endpoints.omniatech.io/v1/eth/sepolia/public',
    currencySymbol: 'SEPOLIA',
    blockExplorerUrl: 'https://sepolia.etherscan.io/',
    nativeCurrency: {
      name: 'SEPOLIA',
      symbol: 'SEPOLIA',
      decimals: 18,
    },
  },
]
