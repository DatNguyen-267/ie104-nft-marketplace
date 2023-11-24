import { ModalBuyControllerInstance } from '../../controller/modal-buy'
import { UserPopoverControllerInstance } from '../../controller/user'
import {
  GetAllTokenIdOfCollectionResponse,
  connectAndSwitch,
  getAllTokenIdOfCollection,
  getMetadata,
  getOwnerOfCollection,
  getTokenUri,
  getUrlImage,
} from '../../services'
import { viewAsksByCollection } from '../../services/market'
import { NftItem } from '../../types/nft'
import { shorterAddress } from '../../utils'
import { getAvatarByAddress } from '../../utils/avatar'
import { ethereumAddressRegex } from '../../utils/regex'
import { getAddressExplorerHref } from '../../utils/router-direct'
import {
  AttributeName,
  LoadingStatus,
  NftItemClass,
  NftItemElementObject,
  PageElementId,
} from './types'

export class CollectionPageController {
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
    console.log({ tokenItemNode })
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

    eData.eUserName.innerHTML = shorterAddress(nftItem.owner || '')
    eData.eUserName.title = nftItem.owner || ''

    eData.eAddressNFT.innerHTML = shorterAddress(nftItem.collectionAddress) || ''
    eData.eAddressNFT.title = nftItem.collectionAddress
    eData.eOrderNFT.innerHTML = '#' + nftItem.tokenId.toString()
    eData.eUserAvatar?.setAttribute('href', getAvatarByAddress(nftItem.owner))

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

    eData.eUserName.innerHTML = shorterAddress(nftItem.owner || '') || ''
    eData.eUserName.title = nftItem.owner || ''

    eData.eAddressNFT.innerHTML = shorterAddress(nftItem.collectionAddress) || ''
    eData.eAddressNFT.title = nftItem.collectionAddress
    eData.eOrderNFT.innerHTML = '#' + nftItem.tokenId.toString()
    eData.eUserAvatar?.setAttribute('src', getAvatarByAddress(nftItem.owner))

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

  async getAllNftOfCollection() {
    const searchPrams = window.location.search
    const cltAddress = searchPrams.replace('?cltAddress=', '')
    let labelCollectionAddress = document.querySelector(
      PageElementId.LabelCollectionAddress,
    ) as HTMLDivElement
    let labelCollectionOwner = document.querySelector(
      PageElementId.LabelCollectionOwner,
    ) as HTMLDivElement
    let cltImage = document.querySelector(PageElementId.CltImage) as HTMLDivElement

    console.log({ labelCollectionAddress })
    if (!ethereumAddressRegex.test(cltAddress)) {
      console.log('invalid clt address')
      return
    }
    labelCollectionAddress.innerHTML = shorterAddress(cltAddress)
    labelCollectionAddress.setAttribute('href', getAddressExplorerHref(cltAddress))
    cltImage.setAttribute('src', getAvatarByAddress(cltAddress))
    let listItem: NftItem[] = []
    let listCollectionContainer = document.querySelector(
      PageElementId.ListNftContainer,
    ) as HTMLDivElement

    try {
      const ownerAddress = await getOwnerOfCollection(cltAddress)
      labelCollectionOwner.innerHTML = shorterAddress(ownerAddress)
      labelCollectionOwner.setAttribute('href', getAddressExplorerHref(ownerAddress))
    } catch (error) {}

    try {
      const tokenIds: GetAllTokenIdOfCollectionResponse = await getAllTokenIdOfCollection(
        cltAddress,
      )

      if (!listCollectionContainer) {
        console.log('listCollectionContainer is not exists')
        return
      }
      await this.clearNftContainer()
      tokenIds.forEach((element) => {
        listItem.push({
          collectionAddress: cltAddress,
          tokenId: Number(element.tokenId),
          title: '',
          description: '',
          tokenUri: '',
          owner: element.owner,
          status: 'NotForSale',
          imageUri: '',
          imageGatewayUrl: '',
          price: '',
        })
      })
      listItem.forEach(async (CollectionItem: NftItem, index) => {
        listCollectionContainer.appendChild(await this.CreateNftItemComponent(CollectionItem))
      })

      try {
        const asksOfCollection = await viewAsksByCollection(cltAddress, 0, 100)
        if (asksOfCollection && asksOfCollection.tokenIds && asksOfCollection.tokenIds.length > 0) {
          asksOfCollection.tokenIds.forEach(async (tokenId, index) => {
            const currentIndex = listItem.findIndex((item) => item.tokenId === tokenId)
            if (currentIndex >= 0) {
              listItem[index] = {
                ...listItem[index],
                status: 'Sale',
                price: asksOfCollection.askInfo[index].price,
                seller: asksOfCollection.askInfo[index].seller,
              }
              await this.UpdateNftItemComponent(listItem[index])
            }
          })
        }
      } catch (error) {
        console.log(error)
      }

      await Promise.all(
        listItem.map(async (nftItem: NftItem, index: number) => {
          try {
            const tokenUri = await getTokenUri(nftItem.collectionAddress, nftItem.tokenId)
            listItem[index].tokenUri = tokenUri || ''
          } catch (error) {}
        }),
      )

      await Promise.all(
        listItem.map(async (nftItem: NftItem, index: number) => {
          try {
            const metadata = await getMetadata(nftItem.tokenUri)
            listItem[index].title = metadata.name || ''
            listItem[index].description = metadata.description || ''
            listItem[index].imageUri = metadata.image || ''
            listItem[index].imageGatewayUrl = getUrlImage(metadata.image) || ''
            await this.UpdateNftItemComponent(listItem[index])
          } catch (error) {}
        }),
      )

      console.log({ listItem })
    } catch (error) {
      console.log(error)
    }
  }
}

export const CollectionPageControllerInstance = new CollectionPageController()
