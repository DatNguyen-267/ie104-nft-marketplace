import { ethers } from "ethers";
import { AppError } from "../constants";
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
export function listenForTransactionMined(
  transactionResponse: any,
  provider: any
) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt: any) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
    });
    Promise.resolve();
  });
}
