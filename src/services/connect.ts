import { ethers } from 'ethers'
import { AppError } from '../constants'

import { CHAINS } from '../constants/chains'
import { convertWalletError } from '../utils/errors'
import { getDefaultProvider } from './provider'

export async function connectEarly() {
  console.log('run')
  if (!window.ethereum) {
    throw new Error('No connect detected')
  }
  await window.ethereum
    .request({
      method: 'eth_accounts',
    })
    .then(async (accounts: string[]) => {
      if (accounts.length > 0) {
        await connect()
        return accounts[0]
      } else {
        throw new Error('No connect detected')
      }
    })
}
export async function switchToNetwork(provider: any, chainId: number): Promise<null | void> {
  const formattedChainId = ethers.BigNumber.from(chainId).toHexString()

  if (!provider) {
    throw new Error(AppError.PROVIDER_IS_NOT_VALID)
  }

  const chainTarget = CHAINS.find((chain) => chain.chainId === chainId)

  if (!chainTarget) {
    throw new Error(AppError.NOT_SUPPORTED_CHAIN_ID)
  }
  if (!window.ethereum) return
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainTarget.chainIdHex }],
    })
  } catch (error) {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: chainTarget.chainIdHex,
          chainName: chainTarget.chainName,
          rpcUrls: [chainTarget.rpcUrl],
          nativeCurrency: chainTarget.nativeCurrency,
          blockExplorerUrls: [chainTarget.blockExplorerUrl],
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
    await connect().then((res) => {})
    const provider = getDefaultProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }

    const currentChainId = await getChainCurrentChainId()
    if (!currentChainId) {
      throw new Error(AppError.CHAIN_ID_INVALID)
    }
    await switchToNetwork(provider.provider, currentChainId)
  } catch (error) {
    throw error
  }
}
export async function getBalance(contractAddress: string) {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
  }
}

export async function getAccountAddress() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = await getDefaultProvider()
    try {
      const address = await provider?.getSigner().getAddress()
      return address
    } catch (error) {
      console.log(error)
      return ''
    }
  }
}

export async function getChainCurrentChainId() {
  const localChainId = localStorage.getItem('chainId')
  if (localChainId) {
    return Number(localChainId)
  } else {
    console.log('rerroroero')
    if (typeof window.ethereum !== 'undefined') {
      const provider = getDefaultProvider()
      if (!provider) return null
      try {
        const chainId = parseInt(await provider?.send('eth_chainId', []), 16)
        const isSupport = CHAINS.find((chain) => chain.chainId === chainId)

        if (!isSupport) {
          return null
        } else {
          return chainId
        }
      } catch (error) {
        console.log(error)
        return null
      }
    }
  }
}
