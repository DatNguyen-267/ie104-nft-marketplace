import { ethers } from "ethers";
import { NFTStorage } from "nft.storage";
import { NFT_ABI } from "../abis";
import { AppError, MARKETPLACE_ADDRESS, NFT_ADDRESS } from "../constants";
import { ProviderOptions } from "../types";
import { MetadataInput } from "../types/metadata";
import { getProvider } from "./provider";

// export const STORAGE_API_KEY = process.env.STORAGE_API_KEY || "";
export const STORAGE_API_KEY = "";
export async function createMetadata(
  file: File,
  title: string,
  description: string
) {
  try {
    if (!STORAGE_API_KEY) {
      throw new Error(AppError.API_KEY_INVALID);
    }
    const client = new NFTStorage({ token: STORAGE_API_KEY as string });
    const img = new Blob([file]);
    const data: MetadataInput = {
      image: img,
      name: title,
      description,
    };
    const cid = await client.store(data);
    return cid.url;
  } catch (error) {
    throw error;
  }
}
async function approveSpenderToAccessNft(
  cltAddress: string,
  spenderAddress = MARKETPLACE_ADDRESS,
  tokenId: string,
  options?: ProviderOptions
) {
  try {
    const provider = getProvider(options?.provider);
    const tokenContract = new ethers.Contract(
      cltAddress,
      NFT_ABI,
      provider.getSigner()
    );
    const transaction: any = await tokenContract.approve(
      spenderAddress,
      tokenId
    );
    const transactionReceipt: any = await transaction.wait();
    console.log("approve receipt:", transactionReceipt);
  } catch (error) {
    throw error;
  }
}
async function mintNFT(
  cltAddress: string,
  addressTo: string,
  tokenUri: string,
  options?: ProviderOptions
) {
  try {
    const provider = getProvider(options?.provider);
    const nftContract = new ethers.Contract(cltAddress, NFT_ABI, provider);
    const transaction = await nftContract.safeMint(addressTo, tokenUri);
    const transactionReceipt: any = await transaction.wait();
    console.log("Mint receipt:", transactionReceipt);
    return transactionReceipt;
  } catch (error) {
    throw error;
  }
}
export async function getTokenUri(
  cltAddress: string,
  tokenId: number,
  options?: ProviderOptions
) {
  try {
    const provider = getProvider(options?.provider);
    const contract = new ethers.Contract(cltAddress, NFT_ABI, provider);
    const tokenUri: string = await contract.tokenURI(tokenId);
    return tokenUri;
  } catch (error) {
    throw error;
  }
}

async function getOwner(
  cltAddress: string,
  tokenId: number,
  options?: ProviderOptions
) {
  try {
    const provider = getProvider(options?.provider);
    const contract = new ethers.Contract(cltAddress, NFT_ABI, provider);
    const addressOwner = contract.ownerOf(tokenId);
    return addressOwner;
  } catch (error) {
    throw error;
  }
}

async function getYourTokens(
  cltAddress: string,
  creatorAddress: string,
  options?: ProviderOptions
) {
  try {
    let listTokenId: number[] = [];
    const provider = getProvider(options?.provider);
    const contract = new ethers.Contract(cltAddress, NFT_ABI, provider);
    let tokenId = 0;
    while (true) {
      try {
        const token = await contract.ownerOf(tokenId);
        if (token.toLowerCase() === creatorAddress.toLowerCase())
          listTokenId.push(tokenId);
        tokenId++;
      } catch (error) {
        break;
      }
    }
    return listTokenId;
  } catch (error) {
    throw error;
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
