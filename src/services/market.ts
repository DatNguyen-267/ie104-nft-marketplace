import { BigNumber, ethers } from 'ethers'
import { MARKETPLACE_ABI } from '../abis'
import { AppError, DEFAULT_ADDRESS, MARKETPLACE_ADDRESS, WBNB_ADDRESS } from '../constants'
import { approveSpenderToAccessNft } from './nft'
import { getDefaultProvider, getProvider, getRpcProvider } from './provider'
import { approveTokenExchange } from './token-exchange'

export type CollectionDetail = {
  creatorAddress: string
  status: number
  creatorFee: BigNumber
  tradingFee: BigNumber
  whitelistChecker: string
}
export type ViewMarketCollectionsResponse = {
  collectionDetails: CollectionDetail[]
  collectionAddresses: string[]
}

/*
 * @notice View addresses and details for all the collections available for trading
 * @param cursor: cursor
 * @param size: size of the response
 */
export async function viewMarketCollections(
  cursor: number = 0,
  size: number = 10,
): Promise<ViewMarketCollectionsResponse> {
  try {
    const provider = getRpcProvider()
    if (!provider) {
      throw new Error('Provider is not found')
    }

    const marketContract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider)
    console.log({ marketContract })
    const collectionsResponse = await marketContract.viewCollections(cursor, size)

    const collectionDetails = collectionsResponse['collectionDetails']
    const collectionAddresses = collectionsResponse['collectionAddresses']
    return {
      collectionDetails,
      collectionAddresses,
    }
  } catch (error) {
    throw error
  }
}

export type AskInfo = {
  price: BigNumber
  seller: string
}
export type TokenIds = BigNumber[]
export type AskInfoRaw = [string, BigNumber][]
export type ViewAsksByCollectionAndSellerRaw = [TokenIds, AskInfoRaw, BigNumber]
export type ViewAsksByCollectionAndSellerResponse = {
  askInfo: AskInfo[]
  tokenIds: TokenIds
  size: BigNumber
}[]

/**
 * @notice View ask orders for a given collection and a seller
 * @param collection: address of the collection
 * @param seller: address of the seller
 * @param cursor: cursor
 * @param size: size of the response
 */
export async function viewAsksByCollectionAndSeller(
  collectionAddress: string,
  sellerAddress: string,
  cursor: number = 0,
  size: number = 10,
) {
  try {
    const provider = getProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const marketContract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider)
    const asks: ViewAsksByCollectionAndSellerRaw =
      await marketContract.viewAsksByCollectionAndSeller(
        collectionAddress,
        sellerAddress,
        cursor,
        size,
      )
    return {
      askInfo: asks[1].map((ask) => {
        return {
          price: ethers.utils.formatEther(ask[1].toString()),
          seller: ask[0],
        }
      }),
      tokenIds: asks[0].map((tokenId) => {
        return tokenId.toNumber()
      }),
      size: asks[2].toNumber(),
    }
  } catch (error) {
    throw error
  }
}

/**
 * @notice Calculate price and associated fees for a collection
 * @param collection: address of the collection
 * @param price: listed price
 */
export async function calculatePriceAndFeesForCollection(collection: string, price: string) {
  try {
    const provider = getProvider()
    if (!provider) {
      throw new Error('Provider is not found')
    }
    const marketContract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider)
    const collectionsResponse = await marketContract.calculatePriceAndFeesForCollection(
      collection,
      price,
    )

    return {
      netPrice: collectionsResponse['netPrice'],
      tradingFee: collectionsResponse['tradingFee'],
      creatorFee: collectionsResponse['creatorFee'],
    }
  } catch (error) {
    throw error
  }
}

/**
 * @notice Check asks for an array of tokenIds in a collection
 * @param collection: address of the collection
 * @param tokenIds: array of tokenId
 */
export async function viewAsksByCollection(
  collectionAddress: string,
  cursor: number = 0,
  size: number = 10,
) {
  try {
    const provider = getRpcProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const marketContract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider)
    console.log({ marketContract })
    const asks: ViewAsksByCollectionAndSellerRaw = await marketContract.viewAsksByCollection(
      collectionAddress,
      cursor,
      size,
    )
    return {
      askInfo: asks[1].map((ask) => {
        return {
          price: ethers.utils.formatEther(ask[1].toString()),
          seller: ask[0],
        }
      }),
      tokenIds: asks[0].map((tokenId) => {
        return tokenId.toNumber()
      }),
      size: asks[2].toNumber(),
    }
  } catch (error) {
    throw error
  }
}

/**
 * @notice Buy token with WBNB by matching the price of an existing ask order
 * @param _collection: contract address of the NFT
 * @param _tokenId: tokenId of the NFT purchased
 * @param _price: price (must be equal to the askPrice set by the seller) unit Ethers
 */
export async function buyTokenUsingWBNB(collectionAddress: string, tokenId: number, price: string) {
  try {
    const provider = getDefaultProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const marketContract = new ethers.Contract(
      MARKETPLACE_ADDRESS,
      MARKETPLACE_ABI,
      provider.getSigner(),
    )
    try {
      const receiptApprove: any = await approveTokenExchange(
        MARKETPLACE_ADDRESS,
        WBNB_ADDRESS,
        ethers.utils.parseEther(price).toString(),
      )
      console.log(receiptApprove)
    } catch (error) {
      console.log(error)
      throw new Error(AppError.APPROVE_TOKEN_EXCHANGE_FAILED)
    }
    const transaction = await marketContract.buyTokenUsingWBNB(
      collectionAddress,
      tokenId,
      ethers.utils.parseEther(price),
    )
    const transactionReceipt: any = await transaction.wait()
    console.log('buyTokenUsingWBNB Receipt:', transactionReceipt)
    return transactionReceipt
  } catch (error) {
    console.log(error)
    throw error
  }
}

/**
 * @notice Create ask order
 * @param _collection: contract address of the NFT
 * @param _tokenId: tokenId of the NFT
 * @param _askPrice: price for listing (in wei)
 */
export async function createAskOrder(collectionAddress: string, tokenId: number, price: string) {
  try {
    const provider = getDefaultProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const marketContract = new ethers.Contract(
      MARKETPLACE_ADDRESS,
      MARKETPLACE_ABI,
      provider.getSigner(),
    )
    try {
      const receiptApprove = await approveSpenderToAccessNft(
        collectionAddress,
        MARKETPLACE_ADDRESS,
        tokenId,
      )
      console.log(receiptApprove)
    } catch (error) {
      throw new Error(AppError.APPROVE_SPENDER_TO_ACCESS_NFT_FAILED)
    }

    const transaction = await marketContract.createAskOrder(
      collectionAddress,
      tokenId,
      ethers.utils.parseEther(price),
    )
    const transactionReceipt = await transaction.wait()
    console.log('createAskOrder Receipt:', transactionReceipt)
    return transactionReceipt
  } catch (error) {
    throw error
  }
}

/**
 * @notice Add a new collection
 * @param _collection: collection address
 * @param _creator: creator address (must be 0x00 if none)
 * @param _whitelistChecker: whitelist checker (for additional restrictions, must be 0x00 if none)
 * @param _tradingFee: trading fee (100 = 1%, 500 = 5%, 5 = 0.05%)
 * @param _creatorFee: creator fee (100 = 1%, 500 = 5%, 5 = 0.05%, 0 if creator is 0x00)
 * @dev Callable by admin
 */
export async function importCollection(
  collectionAddress: string,
  creatorAddress: string,
  tradingFee: number = 100,
  creatorFee: number = 100,
  whiteListChecker = DEFAULT_ADDRESS,
) {
  try {
    const provider = getProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const marketContract = new ethers.Contract(
      MARKETPLACE_ADDRESS,
      MARKETPLACE_ABI,
      provider.getSigner(),
    )
    const addResponse = await marketContract.addCollection(
      collectionAddress,
      creatorAddress,
      whiteListChecker,
      tradingFee,
      creatorFee,
    )
    console.log({ addResponse })
    return {}
  } catch (error) {
    throw error
  }
}

/**
 * @notice Cancel existing ask order
 * @param _collection: contract address of the NFT
 * @param _tokenId: tokenId of the NFT
 */
export async function cancelAskOrder(collectionAddress: string, tokenId: string) {
  try {
    const provider = getProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const marketContract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider)
    const response = await marketContract.cancelAskOrder(collectionAddress, tokenId)
    console.log({ response })
    return true
  } catch (error) {
    throw error
  }
}

/**
 * @notice Modify existing ask order
 * @param _collection: contract address of the NFT
 * @param _tokenId: tokenId of the NFT
 * @param _newPrice: new price for listing (in wei)
 */
export async function modifyAskOrder(collectionAddress: string, tokenId: string, newPrice: string) {
  try {
    const provider = getProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const marketContract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider)
    const response = await marketContract.modifyAskOrder(collectionAddress, tokenId, newPrice)
    console.log({ response })
    return {}
  } catch (error) {
    throw error
  }
}

/**
 * @notice Check ask for an array of tokenId in a collection
 * @param collection: address of the collection
 * @param tokenId: array of tokenId
 */
export async function viewAskByCollectionAndTokenId(collectionAddress: string, tokenId: string) {
  try {
    const provider = getProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const marketContract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider)
    const response = await marketContract.viewAsksByCollectionAndTokenIds(collectionAddress, [
      tokenId,
    ])
    console.log({ response })
    return {}
  } catch (error) {
    throw error
  }
}

/**
 * @notice Check ask for an array of tokenId in a collection
 * @param collection: address of the collection
 * @param tokenId: array of tokenId
 */
export async function viewAsksByCollectionAndTokenIds(
  collectionAddress: string,
  tokenIds: string[],
) {
  try {
    const provider = getProvider()
    if (!provider) {
      throw new Error(AppError.PROVIDER_IS_NOT_VALID)
    }
    const marketContract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider)
    const response = await marketContract.viewAsksByCollectionAndTokenIds(
      collectionAddress,
      tokenIds,
    )
    console.log({ response })
    return {}
  } catch (error) {
    throw error
  }
}
