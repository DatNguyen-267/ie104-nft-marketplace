import { DEFAULT_NFT_ITEM } from '../constants/default-data'
import { ModalBuyControllerInstance } from '../controller/modal-buy'
import { UserPopoverControllerInstance } from '../controller/user'
import { connectAndSwitch, getMetadata, getTokenUri, getUrlImage } from '../services'
import { viewAsksByCollection, viewMarketCollections } from '../services/market'
import { NftItem } from '../types/nft'
import { shorterAddress } from '../utils'
import {
  AttributeName,
  CardItemClass,
  LoadingStatus,
  NftItemClass,
  NftItemElementObject,
  PageElementId,
} from './types'

export class LandingPageController {
  constructor() {}

  async handleBuyNft(nftItem: NftItem) {
    try {
      await connectAndSwitch()
      await UserPopoverControllerInstance.connect()

      try {
        ModalBuyControllerInstance.set(nftItem)
        ModalBuyControllerInstance.open()
      } catch (error) {}
    } catch (error) {}
  }

  async UpdateNftItemComponent(nftItem: NftItem): Promise<void> {
    if (!nftItem) return
    let listNftContainer = document.querySelector(PageElementId.ListNftContainer) as HTMLDivElement
    if (!listNftContainer) {
      console.log('listNftContainer is not exists')
      return
    }
    const tokenItemNode = listNftContainer.querySelector(
      `div[data-token-id="${nftItem.tokenId}"]`,
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
      eAddressNFT: tokenItemNode.querySelector(`.${NftItemClass.AddressNFT}`) as HTMLDivElement,
      eOrderNFT: tokenItemNode.querySelector(`.${NftItemClass.OrderNFT}`) as HTMLDivElement,
    }
    try {
      eData.eImage.src = nftItem.imageGatewayUrl ? nftItem.imageGatewayUrl : '#'
      eData.eContainer.setAttribute(AttributeName.TokenId, nftItem.tokenId.toString())
      eData.eContainer.setAttribute(AttributeName.CltAddress, nftItem.collectionAddress)
      eData.eTitle.innerHTML = nftItem.title
      eData.eTitle.title = nftItem.title
      eData.ePrice.innerHTML = nftItem.price
      eData.ePrice.title = nftItem.price
      eData.eStatus.innerHTML = nftItem.status
      eData.eMetadataUri.innerHTML = nftItem.tokenUri
      eData.eUserName.innerHTML = shorterAddress(nftItem.seller || '')
      eData.eUserName.title = nftItem.seller || ''
      eData.eAddressNFT.innerHTML = shorterAddress(nftItem.collectionAddress) || ''
      eData.eAddressNFT.title = nftItem.collectionAddress
      eData.eOrderNFT.innerHTML = '#' + nftItem.tokenId.toString()
    } catch (error) {
      console.log(error)
    }

    eData.eButtonBuy.style.display = 'flex'

    eData.eButtonBuy.addEventListener('click', () => {
      this.handleBuyNft(nftItem)
    })
  }
  async UpdateCardItemComponent(nftItem: NftItem): Promise<void> {
    if (!nftItem) return
    let listCardContainer = document.querySelector(
      PageElementId.ContainerHeroCard,
    ) as HTMLDivElement
    if (!listCardContainer) {
      console.log('listCardContainer is not exists')
      return
    }
    console.log({ listCardContainer })
    const tokenItemNode = listCardContainer.querySelector(
      `div[data-token-id="${nftItem.tokenId}"]`,
    ) as HTMLDivElement
    console.log({ tokenItemNode, nftItem })
    if (!tokenItemNode) return
    tokenItemNode.style.display = 'flex'

    if (nftItem.title && nftItem.imageUri) {
      tokenItemNode?.setAttribute(AttributeName.Loading, LoadingStatus.Success)
    } else {
      tokenItemNode?.setAttribute(AttributeName.Loading, LoadingStatus.Pending)
    }
    const eData = {
      eContainer: tokenItemNode,
      eTitle: tokenItemNode.querySelector(`.${CardItemClass.Title}`) as HTMLDivElement,
      eUserName: tokenItemNode.querySelector(`.${CardItemClass.UserName}`) as HTMLDivElement,
    }
    console.log({ imageGatewayUrl: nftItem.imageGatewayUrl })
    eData.eContainer.style.setProperty('background', `url(${nftItem.imageGatewayUrl})`)
    try {
      eData.eTitle.innerHTML = nftItem.title
      eData.eTitle.title = nftItem.title
      eData.eUserName.innerHTML = shorterAddress(nftItem.seller || '')
      eData.eUserName.title = nftItem.seller || ''
    } catch (error) {}
  }

  async CreateCardComponent(nftItem: NftItem): Promise<HTMLDivElement> {
    const template = document.querySelector('#container-card-template') as HTMLDivElement
    if (!template) return document.createElement('div')

    const tokenItemNode = template.cloneNode(true) as HTMLDivElement
    tokenItemNode.style.display = 'flex'

    const eData = {
      eContainer: tokenItemNode,
      eTitle: tokenItemNode.querySelector(`.${CardItemClass.Title}`) as HTMLDivElement,
      eUserName: tokenItemNode.querySelector(`.${CardItemClass.UserName}`) as HTMLDivElement,
    }
    eData.eContainer.style.setProperty('background', `url(${nftItem.imageGatewayUrl})`)
    eData.eContainer.setAttribute(AttributeName.TokenId, nftItem.tokenId.toString())
    eData.eContainer.setAttribute(AttributeName.CltAddress, nftItem.collectionAddress)
    eData.eContainer.setAttribute(AttributeName.Loading, LoadingStatus.Pending)
    try {
      eData.eTitle.innerHTML = nftItem.title
      eData.eTitle.title = nftItem.title
      eData.eUserName.innerHTML = shorterAddress(nftItem.seller || '')
      eData.eUserName.title = nftItem.seller || ''
    } catch (error) {
      console.log(error)
    }

    return tokenItemNode
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
      eAddressNFT: tokenItemNode.querySelector(`.${NftItemClass.AddressNFT}`) as HTMLDivElement,
      eOrderNFT: tokenItemNode.querySelector(`.${NftItemClass.OrderNFT}`) as HTMLDivElement,
    }

    eData.eImage.src = nftItem.imageGatewayUrl ? nftItem.imageGatewayUrl : '#'
    eData.eContainer.setAttribute(AttributeName.TokenId, nftItem.tokenId.toString())
    eData.eContainer.setAttribute(AttributeName.CltAddress, nftItem.collectionAddress)
    eData.eContainer.setAttribute(AttributeName.Loading, LoadingStatus.Pending)
    console.log(nftItem)
    try {
      eData.eTitle.innerHTML = nftItem.title
      eData.eTitle.title = nftItem.title
      eData.ePrice.innerHTML = nftItem.price
      eData.ePrice.title = nftItem.price
      eData.eStatus.innerHTML = nftItem.status
      eData.eMetadataUri.innerHTML = nftItem.tokenUri
      eData.eUserName.innerHTML = shorterAddress(nftItem.seller || '')
      eData.eUserName.title = nftItem.seller || ''
      eData.eAddressNFT.innerHTML = shorterAddress(nftItem.collectionAddress) || ''
      eData.eAddressNFT.title = nftItem.collectionAddress
      eData.eOrderNFT.innerHTML = '#' + nftItem.tokenId.toString()
      eData.eButtonBuy.style.display = 'flex'
    } catch (error) {
      console.log(error)
    }
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

  async getAllNftOfMarket() {
    let listNfts: NftItem[] = []
    let listNftReview: NftItem[] = []
    let listCard: NftItem[] = []

    let listNftContainer = document.querySelector(PageElementId.ListNftContainer) as HTMLDivElement
    let listCardHeroContainer = document.querySelector(
      PageElementId.ContainerHeroCard,
    ) as HTMLDivElement
    if (!listNftContainer) {
      console.log('listNftContainer is not exists')
      return
    }

    try {
      const collections = await viewMarketCollections()
      console.log({ collections })
      await Promise.all(
        collections.collectionAddresses.map(async (collectionAddress: string) => {
          try {
            const asksOfCollection = await viewAsksByCollection(collectionAddress, 0, 100)
            console.log({ asksOfCollection })
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

      this.clearNftContainer()

      listCard = listNfts.slice(6, 9)
      listCard.forEach(async (nftItem: NftItem, index) => {
        listCardHeroContainer.appendChild(await this.CreateCardComponent(nftItem))
      })

      listNftReview = listNfts.slice(0, 6)
      listNftReview.forEach(async (nftItem: NftItem, index) => {
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

      // Get metadata of tokenId
      await Promise.all(
        listNfts.map(async (nftItem: NftItem, index: number) => {
          try {
            const metadata = await getMetadata(nftItem.tokenUri)
            listNfts[index].title = metadata.name || ''
            listNfts[index].description = metadata.description || ''
            listNfts[index].imageUri = metadata.image || ''
            listNfts[index].imageGatewayUrl = getUrlImage(metadata.image) || ''

            await this.UpdateNftItemComponent(listNfts[index])
            await this.UpdateCardItemComponent(listNfts[index])
          } catch (error) {}
        }),
      )
    } catch (error) {
      console.log(error)
    }
  }
}

export const LandingPageControllerInstance = new LandingPageController()
