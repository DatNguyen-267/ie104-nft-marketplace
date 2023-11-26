import { ethers } from 'ethers'
import { CHAINS } from '../constants/chains'
import { getChainCurrentChainId } from './connect'

export enum WalletSupported {
  Metamask = 'Metamask',
  WalletConnect = 'Wallet Connect',
  CoinBase = 'Coin Base',
}

export const ExtensionService = {
  [WalletSupported.Metamask]: window.ethereum,
}

export async function getRpcProvider() {
  const currentChainId = (await getChainCurrentChainId()) || CHAINS[0].chainId
  const currentRpcUrl = CHAINS.find((chain) => chain.chainId === currentChainId)?.rpcUrl
  return new ethers.providers.JsonRpcProvider(currentRpcUrl)
}

export function getDefaultProvider() {
  if (window.ethereum && typeof window.ethereum !== 'undefined') {
    return new ethers.providers.Web3Provider(window.ethereum)
  }
}

export async function getProvider(): Promise<
  ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider | undefined
> {
  try {
    const defaultProvider = getDefaultProvider()
    return defaultProvider
  } catch (error) {}
  try {
    const rpcProvider = await getRpcProvider()
    return rpcProvider
  } catch (error) {}
  return undefined
}

export function isConnectedWallet(wallet?: WalletSupported) {
  switch (wallet) {
    case WalletSupported.Metamask: {
      return ExtensionService[WalletSupported.Metamask].isConnected()
    }
  }
}
