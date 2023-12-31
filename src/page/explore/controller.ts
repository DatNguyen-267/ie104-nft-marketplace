import { ADDRESS_OF_CHAINS, DEFAULT_ADDRESS } from '../../constants'
import { CHAINS } from '../../constants/chains'
import { DEFAULT_NFT_ITEM } from '../../constants/default-data'
import { ModalBuyControllerInstance } from '../../controller/modal-buy'
import { getChainCurrentChainId, getMetadata, getTokenUri, getUrlImage } from '../../services'
import { viewAsksByCollection, viewMarketCollections } from '../../services/market'
import { NftItem } from '../../types/nft'
import { shorterAddress } from '../../utils'
import { getAvatarByAddress } from '../../utils/avatar'
import { getAddressExplorerHref, getCollectionDetailHref } from '../../utils/router-direct'
import {
  AttributeName,
  LoadingStatus,
  NftItemClass,
  NftItemElementObject,
  PageElementId,
} from './types'

export class ExplorePageController {
  constructor() {}

  async UpdateNftItemComponent(nftItem: NftItem): Promise<void> {
    let listNftContainer = document.querySelector(PageElementId.ListNftContainer) as HTMLDivElement
    if (!listNftContainer) {
      console.log('listNftContainer is not exists')
      return
    }

    const tokenItemNode = listNftContainer.querySelector(
      `div[data-token-id="${nftItem.tokenId}"][${AttributeName.CltAddress}="${nftItem.collectionAddress}"]`,
    ) as HTMLDivElement

    if (!tokenItemNode) return
    if (nftItem.title && nftItem.imageUri) {
      tokenItemNode?.setAttribute(AttributeName.Loading, LoadingStatus.Success)
    } else {
      tokenItemNode?.setAttribute(AttributeName.Loading, LoadingStatus.Pending)
    }
    const eData: NftItemElementObject = {
      eContainer: tokenItemNode,
      eDescription: tokenItemNode.querySelector(`.${NftItemClass.Description}`) as HTMLDivElement,
      eImage: tokenItemNode.querySelector(`.${NftItemClass.Image}`) as HTMLImageElement,
      eMetadataUri: tokenItemNode.querySelector(`.${NftItemClass.MetadataUri}`) as HTMLDivElement,
      ePrice: tokenItemNode.querySelector(`.${NftItemClass.Price}`) as HTMLDivElement,
      eStatus: tokenItemNode.querySelector(`.${NftItemClass.Status}`) as HTMLDivElement,
      eTitle: tokenItemNode.querySelector(`.${NftItemClass.Title}`) as HTMLDivElement,
      eButtonBuy: tokenItemNode.querySelector(`.${NftItemClass.ButtonBuy}`) as HTMLButtonElement,
      eUserName: tokenItemNode.querySelector(`.${NftItemClass.UserName}`) as HTMLDivElement,
      eAddressNFT: tokenItemNode.querySelector(`.${NftItemClass.AddressNFT}`) as HTMLAnchorElement,
      eOrderNFT: tokenItemNode.querySelector(`.${NftItemClass.OrderNFT}`) as HTMLDivElement,
      eUserAvatar: tokenItemNode.querySelector(`.${NftItemClass.UserAvatar}`) as HTMLImageElement,
    }
    eData.eImage.src = nftItem.imageGatewayUrl
      ? nftItem.imageGatewayUrl
      : getAvatarByAddress(nftItem.collectionAddress)
    eData.eContainer.setAttribute(AttributeName.TokenId, nftItem.tokenId.toString())
    eData.eContainer.setAttribute(AttributeName.CltAddress, nftItem.collectionAddress)
    eData.eTitle.innerHTML = nftItem.title
    eData.eTitle.title = nftItem.title
    eData.eDescription.innerHTML = nftItem.description
    eData.ePrice.innerHTML = nftItem.price
    eData.ePrice.title = nftItem.price
    eData.eStatus.innerHTML = nftItem.status
    eData.eMetadataUri.innerHTML = nftItem.tokenUri
    eData.eUserName.innerHTML = shorterAddress(nftItem.seller || '')
    eData.eUserName.title = nftItem.seller || ''
    eData.eAddressNFT.innerHTML = shorterAddress(nftItem.collectionAddress) || ''
    eData.eAddressNFT.title = nftItem.collectionAddress
    eData.eAddressNFT.href = getCollectionDetailHref(nftItem.collectionAddress)

    eData.eOrderNFT.innerHTML = '#' + nftItem.tokenId.toString()
    eData.eUserAvatar.src = getAvatarByAddress(nftItem.seller || DEFAULT_ADDRESS)

    eData.eButtonBuy.style.display = 'block'
    eData.eButtonBuy.addEventListener('click', () => {
      this.handleBuyNft(nftItem)
    })
  }
  async CreateNftItemComponent(nftItem: NftItem): Promise<HTMLDivElement> {
    const template = document.querySelector('#nft-template')
      ?.firstElementChild as HTMLDivElement | null
    if (!template) return document.createElement('div')

    const tokenItemNode = template.cloneNode(true) as HTMLDivElement
    const eData: NftItemElementObject = {
      eContainer: tokenItemNode,
      eDescription: tokenItemNode.querySelector(`.${NftItemClass.Description}`) as HTMLDivElement,
      eImage: tokenItemNode.querySelector(`.${NftItemClass.Image}`) as HTMLImageElement,
      eMetadataUri: tokenItemNode.querySelector(`.${NftItemClass.MetadataUri}`) as HTMLDivElement,
      ePrice: tokenItemNode.querySelector(`.${NftItemClass.Price}`) as HTMLDivElement,
      eStatus: tokenItemNode.querySelector(`.${NftItemClass.Status}`) as HTMLDivElement,
      eTitle: tokenItemNode.querySelector(`.${NftItemClass.Title}`) as HTMLDivElement,
      eButtonBuy: tokenItemNode.querySelector(`.${NftItemClass.ButtonBuy}`) as HTMLButtonElement,
      eUserName: tokenItemNode.querySelector(`.${NftItemClass.UserName}`) as HTMLDivElement,
      eAddressNFT: tokenItemNode.querySelector(`.${NftItemClass.AddressNFT}`) as HTMLAnchorElement,
      eOrderNFT: tokenItemNode.querySelector(`.${NftItemClass.OrderNFT}`) as HTMLDivElement,
      eUserAvatar: tokenItemNode.querySelector(`.${NftItemClass.UserAvatar}`) as HTMLImageElement,
    }

    eData.eImage.src = nftItem.imageGatewayUrl
      ? nftItem.imageGatewayUrl
      : getAvatarByAddress(nftItem.collectionAddress)
    eData.eContainer.setAttribute(AttributeName.TokenId, nftItem.tokenId.toString())
    eData.eContainer.setAttribute(AttributeName.CltAddress, nftItem.collectionAddress)
    eData.eContainer.setAttribute(AttributeName.Loading, LoadingStatus.Pending)

    eData.eTitle.innerHTML = nftItem.title
    eData.eTitle.title = nftItem.title
    eData.eDescription.innerHTML = nftItem.description
    eData.ePrice.innerHTML = nftItem.price
    eData.ePrice.title = nftItem.price
    eData.eStatus.innerHTML = nftItem.status
    eData.eMetadataUri.innerHTML = nftItem.tokenUri
    eData.eUserName.innerHTML = shorterAddress(nftItem.seller || '') || ''
    eData.eUserName.title = nftItem.seller || ''
    eData.eAddressNFT.innerHTML = shorterAddress(nftItem.collectionAddress) || ''
    eData.eAddressNFT.title = nftItem.collectionAddress
    eData.eAddressNFT.href = getCollectionDetailHref(nftItem.collectionAddress)

    eData.eOrderNFT.innerHTML = '#' + nftItem.tokenId.toString()
    eData.eUserAvatar.src = getAvatarByAddress(nftItem.seller || DEFAULT_ADDRESS)

    eData.eButtonBuy.style.display = 'block'
    eData.eButtonBuy.addEventListener('click', () => {
      this.handleBuyNft(nftItem)
    })

    return tokenItemNode
  }
  async clearNftContainer() {
    try {
      let listNftContainer = document.querySelector(
        PageElementId.ListNftContainer,
      ) as HTMLDivElement
      if (!listNftContainer) {
        console.log('listNftContainer is not exists')
        return
      }
      listNftContainer.innerHTML = ''
    } catch (error) {
      console.log(error)
    }
  }

  async handleBuyNft(nftItem: NftItem) {
    try {
      try {
        ModalBuyControllerInstance.set(nftItem)
        ModalBuyControllerInstance.open()
      } catch (error) {}
    } catch (error) {}
  }

  async getAllNftOfMarket() {
    let listNfts: NftItem[] = []
    let listNftContainer = document.querySelector(PageElementId.ListNftContainer) as HTMLDivElement
    if (!listNftContainer) {
      console.log('listNftContainer is not exists')
      return
    }
    const currentChainId = (await getChainCurrentChainId()) || CHAINS[0].chainId
    const currentMarketAddress = ADDRESS_OF_CHAINS[currentChainId].MARKET
    console.log({ currentChainId })
    try {
      const collections = await viewMarketCollections(currentMarketAddress)

      await Promise.all(
        collections.collectionAddresses.map(async (collectionAddress: string) => {
          try {
            const asksOfCollection = await viewAsksByCollection(
              currentMarketAddress,
              collectionAddress,
              0,
              100,
            )
            if (
              asksOfCollection &&
              asksOfCollection.tokenIds &&
              asksOfCollection.tokenIds.length > 0
            ) {
              asksOfCollection.tokenIds.forEach((tokenId, index) => {
                listNfts.push({
                  ...DEFAULT_NFT_ITEM,
                  collectionAddress: collectionAddress,
                  tokenId: tokenId,
                  status: 'Sale',
                  price: asksOfCollection.askInfo[index].price,
                  seller: asksOfCollection.askInfo[index].seller,
                })
              })
            }
          } catch (error) {
            console.log(error)
          }
        }),
      )
      await this.clearNftContainer()
      listNfts.forEach(async (nftItem: NftItem, index) => {
        listNftContainer.appendChild(await this.CreateNftItemComponent(nftItem))
      })

      await Promise.all(
        listNfts.map(async (nftItem: NftItem, index: number) => {
          try {
            const tokenUri = await getTokenUri(nftItem.collectionAddress, nftItem.tokenId)
            listNfts[index].tokenUri = tokenUri || ''
          } catch (error) {}
        }),
      )

      await Promise.all(
        listNfts.map(async (nftItem: NftItem, index: number) => {
          try {
            const metadata = await getMetadata(nftItem.tokenUri)
            listNfts[index].title = metadata.name || ''
            listNfts[index].description = metadata.description || ''
            listNfts[index].imageUri = metadata.image || ''
            listNfts[index].imageGatewayUrl = getUrlImage(metadata.image) || ''
            await this.UpdateNftItemComponent(listNfts[index])
          } catch (error) {}
        }),
      )
    } catch (error) {
      console.log(error)
    }
  }
}

export const ExplorePageControllerInstance = new ExplorePageController()
