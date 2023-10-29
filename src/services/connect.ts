import { ethers } from 'ethers'
import { AppError } from '../constants'
import { getDefaultProvider, getProvider } from './provider'
import { convertWalletError } from '../utils/errors'

export async function switchToNetwork(
  provider: any,
  chainId: ChainIdSupported,
): Promise<null | void> {
  const formattedChainId = ethers.BigNumber.from(chainId).toHexString()
  if (!provider) {
    return
  }
  if (!Object.keys(CHAIN_INFO).includes(chainId)) {
    throw new Error(AppError.NOT_SUPPORTED_CHAIN_ID)
  }
  if (!window.ethereum) return
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: formattedChainId }],
    })
  } catch (error) {
    console.log(error)
    const info = CHAIN_INFO[chainId]

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: info.chainId,
          chainName: info.chainName,
          rpcUrls: [info.rpcUrl],
          nativeCurrency: info.nativeCurrency,
          blockExplorerUrls: [info.blockExplorerUrl],
        },
      ],
    })

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: formattedChainId }],
      })
    } catch (error) {
      console.debug('Added network but could not switch chains', error)
    }
  }
}

const isMetaMaskInstalled = () => {
  const { ethereum } = window
  return Boolean(ethereum && ethereum.isMetaMask)
}
export async function connect() {
  if (!window.ethereum) {
    throw new Error(AppError.NOT_INSTALLED_METAMASK)
  }
  if (typeof window.ethereum !== 'undefined') {
    return window.ethereum.request({
      method: 'eth_requestAccounts',
    })
  }
}
export async function connectAndSwitch() {
  try {
    await connect()
      .then((res) => {})
      .catch((err) => {
        if (err.message === AppError.NOT_INSTALLED_METAMASK) {
        }
        console.log(convertWalletError(err))
      })
    const provider = getDefaultProvider()
    if (!provider) {
      return
    }
    await switchToNetwork(provider.provider, '4102')
  } catch (error) {}
}
export async function getBalance(contractAddress: string) {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
  }
}

export type ChainIdSupported = '4102'
export const CHAIN_INFO = {
  '4102': {
    chainId: '4102',
    chainIdHex: '0x1006',
    chainName: 'AIOZ Network Testnet',
    rpcUrl: 'https://eth-ds.testnet.aioz.network',
    nativeCurrency: {
      name: 'AIOZ',
      symbol: 'AIOZ',
      decimals: 18,
    },
    blockExplorerUrl: 'https://testnet.explorer.aioz.network',
  },
}

export async function getAccountAddress() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = await getDefaultProvider()
    try {
      return provider?.getSigner().getAddress()
    } catch (error) {
      throw error
    }
  }
}
