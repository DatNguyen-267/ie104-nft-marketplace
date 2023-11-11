import { DEFAULT_NFT_ITEM } from '../../constants/default-data'
import { ModalBuyControllerInstance } from '../../controller/modal-buy'
import { UserPopoverControllerInstance } from '../../controller/user'
import {
  connectAndSwitch,
  getAccountAddress,
  getMetadata,
  getTokenUri,
  getUrlImage,
} from '../../services'
import { viewAsksByCollection, viewMarketCollections } from '../../services/market'
import { NftItem } from '../../types/nft'
import { shorterAddress } from '../../utils'
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
    eData.eImage.src = nftItem.imageGatewayUrl ? nftItem.imageGatewayUrl : '#'
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
    eData.eOrderNFT.innerHTML = '#' + nftItem.tokenId.toString()

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
      eAddressNFT: tokenItemNode.querySelector(`.${NftItemClass.AddressNFT}`) as HTMLDivElement,
      eOrderNFT: tokenItemNode.querySelector(`.${NftItemClass.OrderNFT}`) as HTMLDivElement,
    }

    console.log({ imageGatewayUrl: nftItem.imageGatewayUrl })
    eData.eImage.src = nftItem.imageGatewayUrl ? nftItem.imageGatewayUrl : '#'
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
    eData.eOrderNFT.innerHTML = '#' + nftItem.tokenId.toString()

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
      await connectAndSwitch()
      await UserPopoverControllerInstance.connect()

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

    try {
      const collections = await viewMarketCollections()
      await Promise.all(
        collections.collectionAddresses.map(async (collectionAddress: string) => {
          try {
            const asksOfCollection = await viewAsksByCollection(collectionAddress, 0, 100)
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
