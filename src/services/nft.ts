import { ethers } from 'ethers'
import { NFTStorage } from 'nft.storage'
import { ABI_ERC721, ABI_PUBLIC_COLLECTION } from '../abis'
import { ADDRESS_OF_CHAINS, AppError, STORAGE_API_KEY } from '../constants'
import { ProviderOptions } from '../types'
import { MetadataInput } from '../types/metadata'
import { getChainCurrentChainId } from './connect'
import { getDefaultProvider, getRpcProvider } from './provider'
import { LoadingControllerInstance } from '../controller/loading'

export async function createMetadata(file: File, title: string, description: string) {
  try {
    if (!STORAGE_API_KEY) {
      throw new Error(AppError.API_KEY_INVALID)
    }
    const client = new NFTStorage({ token: STORAGE_API_KEY as string })
    const img = new Blob([file])
    const data: MetadataInput = {
      image: img,
      name: title,
      description,
    }
    const cid = await client.store(data)
    return cid
  } catch (error) {
    throw error
  }
}

export async function approveSpenderToAccessNft(
  cltAddress: string,
  spenderAddress: string,
  tokenId: number,
) {
  try {
    const provider = getDefaultProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const tokenContract = new ethers.Contract(cltAddress, ABI_ERC721, provider.getSigner())
    const transaction: any = await tokenContract.approve(spenderAddress, tokenId)
    const transactionReceipt: any = await transaction.wait()
    console.log('approve receipt:', transactionReceipt)
  } catch (error) {
    throw error
  }
}

export async function mintNFT(cltAddress: string, addressTo: string, tokenUri: string) {
  try {
    const provider = getDefaultProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const currentChainId = await getChainCurrentChainId()

    const currentAbi =
      currentChainId && cltAddress === ADDRESS_OF_CHAINS[currentChainId].PUBLIC_ERC721_TOKEN
        ? ABI_PUBLIC_COLLECTION
        : ABI_ERC721

    const nftContract = new ethers.Contract(cltAddress, currentAbi, provider?.getSigner())
    const transaction = await nftContract.safeMint(addressTo, tokenUri)
    LoadingControllerInstance.close()
    const transactionReceipt: any = await transaction.wait()
    console.log('Mint receipt:', transactionReceipt)
    return transactionReceipt
  } catch (error) {
    throw error
  }
}

export async function getTokenUri(cltAddress: string, tokenId: number, options?: ProviderOptions) {
  try {
    const provider = await getRpcProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const contract = new ethers.Contract(cltAddress, ABI_ERC721, provider)
    const tokenUri: string = await contract.tokenURI(tokenId)
    return tokenUri
  } catch (error) {
    throw error
  }
}

async function getOwner(cltAddress: string, tokenId: number, options?: ProviderOptions) {
  try {
    const provider = await getRpcProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }

    const contract = new ethers.Contract(cltAddress, ABI_ERC721, provider)
    const addressOwner = contract.ownerOf(tokenId)
    return addressOwner
  } catch (error) {
    throw error
  }
}

async function getYourTokens(
  cltAddress: string,
  creatorAddress: string,
  options?: ProviderOptions,
) {
  try {
    let listTokenId: number[] = []
    const provider = options ? options.provider : getDefaultProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const contract = new ethers.Contract(cltAddress, ABI_ERC721, provider)
    let tokenId = 0
    while (true) {
      try {
        const token = await contract.ownerOf(tokenId)
        if (token.toLowerCase() === creatorAddress.toLowerCase()) listTokenId.push(tokenId)
        tokenId++
      } catch (error) {
        break
      }
    }
    return listTokenId
  } catch (error) {
    throw error
  }
}

export function listenForTransactionMined(transactionResponse: any, provider: any) {
  console.log(`Mining ${transactionResponse.hash}...`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt: any) => {
      console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
    })
    Promise.resolve()
  })
}

export type GetAllTokenIdOfCollectionResponse = {
  tokenId: string
  owner: string
}[]

export async function getAllTokenIdOfCollection(
  collectionAddress: string,
): Promise<GetAllTokenIdOfCollectionResponse> {
  try {
    let listTokenId: GetAllTokenIdOfCollectionResponse = []
    const provider = await getRpcProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const contract = new ethers.Contract(collectionAddress, ABI_ERC721, provider)

    let tokenId = 0
    while (true) {
      try {
        const owner = await contract.ownerOf(tokenId)
        listTokenId.push({
          owner: owner,
          tokenId: tokenId.toString(),
        })
        tokenId++
      } catch (error) {
        break
      }
    }

    return listTokenId
  } catch (error) {
    throw error
  }
}
export async function getAllNftOfCollectionAndOwnerAddress(
  collectionAddress: string,
  walletAddress: string,
) {
  try {
    let listTokenId: number[] = []
    const provider = await getRpcProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const contract = new ethers.Contract(collectionAddress, ABI_ERC721, provider)
    try {
      const totalSupply = parseInt((await contract.totalSupply(walletAddress))._hex, 16)
      if (totalSupply === 0) return
      await Promise.all(
        Array(totalSupply)
          .fill(1)
          .map(async (item, index) => {
            try {
              const token = await contract.ownerOf(index)
              if (token.toLowerCase() === walletAddress.toLowerCase()) listTokenId.push(index)
            } catch (error) {
              console.log(error)
            }
          }),
      )
      return listTokenId
    } catch (error) {
      let index = 0
      while (true) {
        try {
          const token = await contract.ownerOf(index)
          if (token.toLowerCase() === walletAddress.toLowerCase()) listTokenId.push(index)
          index++
        } catch (error) {
          break
        }
      }
      return listTokenId
    }
  } catch (error) {
    throw error
  }
}

export function getUrlImage(cid: string) {
  const url = cid.split('ipfs://')
  return `https://ipfs.io/ipfs/${url[1]}`
}

export async function getMetadata(tokenUri: string) {
  let url = tokenUri.replace('ipfs:/', '')
  return fetch(`https://ipfs.io/ipfs${url}`)
    .then((res) => res.json())
    .catch((err) => undefined)
}

/**
 * @notice
 * @param from: address of sender
 * @param to: address of receiver
 * @param tokenId: array of tokenId
 */
export async function transferFrom(
  collectionAddress: string,
  from: string,
  to: string,
  tokenId: string,
) {
  try {
    const provider = getDefaultProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const nftContract = new ethers.Contract(collectionAddress, ABI_ERC721, provider)
    const response = await nftContract.transferFrom(from, to, tokenId)
    return {}
  } catch (error) {
    throw error
  }
}

export async function getOwnerOfCollection(cltAddress: string) {
  try {
    const provider = await getRpcProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }

    const contract = new ethers.Contract(cltAddress, ABI_ERC721, provider)
    const addressOwner = contract.owner()
    return addressOwner
  } catch (error) {
    throw error
  }
}

export async function getNameOfCollection(cltAddress: string) {
  try {
    const provider = await getRpcProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }

    const contract = new ethers.Contract(cltAddress, ABI_ERC721, provider)
    const addressOwner = contract.name()
    return addressOwner
  } catch (error) {
    throw error
  }
}

export async function getTotalSupply(cltAddress: string) {
  try {
    const provider = await getRpcProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }

    const contract = new ethers.Contract(cltAddress, ABI_ERC721, provider)
    const addressOwner = contract.totalSupply()
    return addressOwner
  } catch (error) {
    throw error
  }
}
