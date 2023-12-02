import { CHAINS, DEFAULT_CHAIN_ID } from '../constants/chains'
import { getDefaultProvider } from '../services'

class ChainManager {
  constructor() {}
  async initChainId() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = getDefaultProvider()
      if (!provider) return null
      try {
        const chainId = parseInt(await provider?.send('eth_chainId', []), 16)
        const isSupport = CHAINS.find((chain) => chain.chainId === chainId)
        console.log(chainId)
        if (isSupport) {
          localStorage.setItem('chainId', chainId.toString())
        } else {
          localStorage.setItem('chainId', DEFAULT_CHAIN_ID.toString())
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
  updateChainId(chainId: string) {
    const isSupported = CHAINS.find((chain) => chain.chainIdHex === chainId)
    if (isSupported) {
      localStorage.setItem('chainId', parseInt(chainId, 16).toString())
    } else {
      localStorage.setItem('chainId', DEFAULT_CHAIN_ID.toString())
    }
  }

  // listener() {
  //   if (window && window.ethereum) {
  //     window.ethereum.on('chainChanged', (chainId: string) => {})
  //   }
  // }
}

export const ChainManagerInstance = new ChainManager()
