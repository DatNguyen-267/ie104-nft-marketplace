import { ethers } from 'ethers'
import { ABI_WRAP_TOKEN } from '../abis'
import { getDefaultProvider } from './provider'

export async function getErc20Balance(cltAddress: string, walletAddress: string): Promise<string> {
  try {
    const provider = getDefaultProvider()
    const contract = new ethers.Contract(cltAddress, ABI_WRAP_TOKEN, provider)
    const balance = await contract.balanceOf(walletAddress)
    return balance.toString()
  } catch (error) {
    throw error
  }
}

export async function getBalanceNativeToken(walletAddress: string) {
  try {
    const provider = getDefaultProvider()
    if (!provider) return
    const balance = await provider.getSigner().getBalance()
    return balance.toString()
  } catch (error) {
    throw error
  }
}

export async function watchErc20Asset(erc20Address: string, symbol: string, decimals: number) {
  if (!window.ethereum) {
    return
  }
  window.ethereum
    .request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: erc20Address,
          symbol: 'FOO',
          decimals: 18,
        },
      },
    })
    .then((data: any) => {
      console.log(data)
    })
    .catch(console.error)
}
