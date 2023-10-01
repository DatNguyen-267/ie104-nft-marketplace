import { ethers } from "ethers";
import { AppError } from "../constants";

const isMetaMaskInstalled = () => {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

export async function connect() {
  if (!window.ethereum) {
    throw new Error(AppError.NOT_INSTALLED_METAMASK);
  }
  if (typeof window.ethereum !== "undefined") {
    return window.ethereum.request({
      method: "eth_requestAccounts",
    });
  }
}

export async function getBalance(contractAddress: string) {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

export type ChainIdSupported = "4102";
export const CHAIN_INFO = {
  "4102": {
    chainId: "4102",
    chainName: "AIOZ Network Testnet",
    rpcUrl: "https://eth-ds.testnet.aioz.network",
    nativeCurrency: "AIOZ",
    blockExplorerUrl: "https://testnet.explorer.aioz.network",
  },
};

export async function switchToNetwork(
  provider: any,
  chainId: ChainIdSupported
): Promise<null | void> {
  const formattedChainId = ethers.BigNumber.from(chainId).toHexString();
  console.log({ formattedChainId });
  console.log({ provider });
  if (!provider?.request) {
    return;
  }

  if (!Object.keys(CHAIN_INFO).includes(chainId)) {
    throw new Error(AppError.NOT_SUPPORTED_CHAIN_ID);
  }
  console.log({ formattedChainId });

  console.log({ formattedChainId });
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: formattedChainId }],
    });
  } catch (error) {
    if ((error as any).code === 4902) {
      const info = CHAIN_INFO[chainId];

      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: info.chainId,
            chainName: info.chainName,
            rpcUrls: [info.rpcUrl],
            nativeCurrency: info.nativeCurrency,
            blockExplorerUrls: [info.blockExplorerUrl],
          },
        ],
      });

      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: formattedChainId }],
        });
      } catch (error) {
        console.debug("Added network but could not switch chains", error);
      }
    } else {
      throw error;
    }
  }
}
