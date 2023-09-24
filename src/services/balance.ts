import { ethers } from "ethers";
import { WBNB_ABI } from "../abis";
import { ProviderOptions } from "../types";
import { getProvider } from "./provider";

export async function getErc20Balance(
  cltAddress: string,
  walletAddress: string,
  options?: ProviderOptions
) {
  try {
    const provider = getProvider(options?.provider);
    const contract = new ethers.Contract(cltAddress, WBNB_ABI, provider);
    const balance = await contract.balanceOf(walletAddress);
    return balance.toString();
  } catch (error) {
    throw error;
  }
}
export async function getBalanceNativeToken(
  walletAddress: string,
  options?: ProviderOptions
) {
  try {
    const provider = getProvider(options?.provider);
    const balance = await provider.getBalance(walletAddress);
    return balance.toString();
  } catch (error) {
    throw error;
  }
}
