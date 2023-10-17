import { ethers } from 'ethers'

export interface ProviderOptions {
  provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider
}
