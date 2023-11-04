import { ethers } from 'ethers'
import { AIOZ_TESTNET_NETWORK } from '../constants/network'
import { ProviderOptions } from '../types'

export enum WalletSupported {
  Metamask = 'Metamask',
  WalletConnect = 'Wallet Connect',
  CoinBase = 'Coin Base',
}

export const ExtensionService = {
  [WalletSupported.Metamask]: window.ethereum,
}

export function getRpcProvider() {
  return new ethers.providers.JsonRpcProvider(AIOZ_TESTNET_NETWORK.rpc)
}
export function getDefaultProvider() {
  if (window.ethereum && typeof window.ethereum !== 'undefined') {
    return new ethers.providers.Web3Provider(window.ethereum)
  }
}

export function getProvider(
  provider?: ProviderOptions['provider'],
): ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider {
  const defaultProvider = getDefaultProvider()
  return provider ? provider : defaultProvider ? defaultProvider : getRpcProvider()
}

export function isConnectedWallet(wallet?: WalletSupported) {
  switch (wallet) {
    case WalletSupported.Metamask: {
      return ExtensionService[WalletSupported.Metamask].isConnected()
    }
  }
}
