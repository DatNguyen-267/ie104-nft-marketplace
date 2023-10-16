import { BigNumber, ethers } from 'ethers'
import { getDefaultProvider } from './provider'
import { MARKETPLACE_ADDRESS } from '../constants'
import { MARKETPLACE_ABI } from '../abis'
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
export async function viewMarketCollections(
  cursor: number = 0,
  size: number = 10,
): Promise<ViewMarketCollectionsResponse> {
  try {
    const provider = getDefaultProvider()
    if (!provider) {
      throw new Error('Provider is not found')
    }
    const marketContract = new ethers.Contract(
      MARKETPLACE_ADDRESS,
      MARKETPLACE_ABI,
      provider.getSigner(),
    )
    const collectionsResponse = await marketContract.viewCollections(cursor, size)
    // struct Collection {
    //   CollectionStatus status; // status of the collection
    //   address creatorAddress; // address of the creator
    //   address whitelistChecker; // whitelist checker (if not set --> 0x00)
    //   uint256 tradingFee; // trading fee (100 = 1%, 500 = 5%, 5 = 0.05%)
    //   uint256 creatorFee; // creator fee (100 = 1%, 500 = 5%, 5 = 0.05%)
    // }
    // function viewCollections(uint256 cursor, uint256 size)
    // external
    // view
    // returns (
    //   address[] memory collectionAddresses,
    //   Collection[] memory collectionDetails,
    //   uint256
    // )

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
export async function viewAsksByCollectionAndSeller(
  collectionAddress: string,
  sellerAddress: string,
  cursor: number = 0,
  size: number = 10,
) {
  try {
    const provider = getDefaultProvider()
    if (!provider) return
    const marketContract = new ethers.Contract(
      MARKETPLACE_ADDRESS,
      MARKETPLACE_ABI,
      provider.getSigner(),
    )
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

export async function calculatePriceAndFeesForCollection(collection: string, price: string) {
  try {
    const provider = getDefaultProvider()
    if (!provider) {
      throw new Error('Provider is not found')
    }
    const marketContract = new ethers.Contract(
      MARKETPLACE_ADDRESS,
      MARKETPLACE_ABI,
      provider.getSigner(),
    )
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

export async function viewAsksByCollection(
  collection: string,
  cursor: number = 0,
  size: number = 10,
) {
  try {
    const provider = getDefaultProvider()
    if (!provider) {
      throw new Error('Provider is not found')
    }
    const marketContract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider)
    const askResponse: ViewAsksByCollectionAndSellerRaw =
      await marketContract.calculatePriceAndFeesForCollection(collection, cursor, size)

    return {
      askInfo: askResponse[1].map((ask) => {
        return {
          price: ethers.utils.formatEther(ask[1].toString()),
          seller: ask[0],
        }
      }),
      tokenIds: askResponse[0].map((tokenId) => {
        return tokenId.toNumber()
      }),
      size: askResponse[2].toNumber(),
    }
  } catch (error) {
    throw error
  }
}
