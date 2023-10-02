import { ethers } from "ethers";
import { AIOZ_TESTNET_NETWORK } from "../constants/network";

export function getRpcProvider() {
  return new ethers.providers.JsonRpcProvider(AIOZ_TESTNET_NETWORK.rpc);
}
export function getDefaultProvider() {
  if (window.ethereum && typeof window.ethereum !== "undefined") {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
}
export function getProvider<T>(
  provider?: T
): ethers.providers.JsonRpcProvider | T | ethers.providers.Web3Provider {
  const defaultProvider = getDefaultProvider();
  return provider
    ? provider
    : defaultProvider
    ? defaultProvider
    : getRpcProvider();
}