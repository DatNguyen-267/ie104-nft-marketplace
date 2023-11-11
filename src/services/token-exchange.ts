import { ethers } from 'ethers'
import { TOKEN_EXCHANGE_ABI } from '../abis'
import { AppError, MARKETPLACE_ADDRESS } from '../constants'
import { ProviderOptions } from '../types/provider'
import { getDefaultProvider, getProvider } from './provider'

export async function approveTokenExchange(
  nftAddressGuy = MARKETPLACE_ADDRESS,
  tokenExchangeAddress: string,
  wad: string,
  providerOptions?: ProviderOptions,
) {
  try {
    let provider = getDefaultProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const tokenContract = new ethers.Contract(
      tokenExchangeAddress,
      TOKEN_EXCHANGE_ABI,
      provider.getSigner(),
    )
    const transaction = await tokenContract.approve(nftAddressGuy, wad)
    const transactionReceipt: any = await transaction.wait()
    console.log('approve receipt:', transactionReceipt)
    return transactionReceipt
  } catch (error) {
    throw error
  }
}
export async function deposit(
  tokenAddress: string,
  value: string, // unit Ether
) {
  try {
    let provider = getProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const tokenContract = new ethers.Contract(
      tokenAddress,
      TOKEN_EXCHANGE_ABI,
      provider.getSigner(),
    )
    const transaction = await tokenContract.deposit({
      value: ethers.utils.parseEther(value),
    })
    const transactionReceipt: any = await transaction.wait()
    console.log('deposit receipt:', transactionReceipt)
    return transactionReceipt
  } catch (error) {
    throw error
  }
}
