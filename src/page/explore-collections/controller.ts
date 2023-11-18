import {
  getNameOfCollection,
  getOwnerOfCollection,
  getTokenUri,
  getTotalSupply,
} from '../../services'
import { CollectionDetail, viewMarketCollections } from '../../services/market'
import { CollectionItem } from '../../types/collection'
import { shorterAddress } from '../../utils'
import { getAvatarByAddress } from '../../utils/avatar'
import { getAddressExplorerHref, getCollectionDetailHref } from '../../utils/router-direct'
import {
  AttributeName,
  CollectionItemClass,
  CollectionItemElementObject,
  PageElementId,
} from './types'

export class ExploreCollectionPageController {
  constructor() {}

  async UpdateCollectionItemComponent(collectionItem: CollectionItem): Promise<void> {
    let listCollectionContainer = document.querySelector(
      PageElementId.ListCollectionContainer,
    ) as HTMLDivElement
    if (!listCollectionContainer) {
      console.log('listCollectionContainer is not exists')
      return
    }

    const tokenItemNode = listCollectionContainer.querySelector(
      `a[data-clt-address="${collectionItem.collectionAddress}"]`,
    ) as HTMLDivElement
    if (!tokenItemNode) return
    const eData: CollectionItemElementObject = {
      eContainer: tokenItemNode,
      eDescription: tokenItemNode.querySelector(
        `.${CollectionItemClass.Description}`,
      ) as HTMLDivElement,
      eImage: tokenItemNode.querySelector(`.${CollectionItemClass.Image}`) as HTMLImageElement,
      eTitle: tokenItemNode.querySelector(`.${CollectionItemClass.Title}`) as HTMLDivElement,
      eCollectionAddress: tokenItemNode.querySelector(
        `.${CollectionItemClass.CollectionAddress}`,
      ) as HTMLAnchorElement,
      eOwnerAddress: tokenItemNode.querySelector(
        `.${CollectionItemClass.OwnerAddress}`,
      ) as HTMLAnchorElement,
      eOwnerAvatar: tokenItemNode.querySelector(
        `.${CollectionItemClass.OwnerAvatar}`,
      ) as HTMLDivElement,
      eTotalSupply: tokenItemNode.querySelector(
        `.${CollectionItemClass.TotalSupply}`,
      ) as HTMLDivElement,
    }

    eData.eContainer.setAttribute(AttributeName.CltAddress, collectionItem.collectionAddress)
    eData.eContainer.setAttribute('href', getCollectionDetailHref(collectionItem.collectionAddress))
    eData.eTitle.innerHTML = collectionItem.name
    eData.eTitle.title = collectionItem.name
    eData.eDescription.innerHTML = collectionItem.description

    eData.eCollectionAddress.innerHTML = shorterAddress(collectionItem.collectionAddress) || ''
    eData.eCollectionAddress.title = collectionItem.collectionAddress
    eData.eCollectionAddress.setAttribute(
      'href',
      getAddressExplorerHref(collectionItem.collectionAddress),
    )

    eData.eOwnerAddress.innerHTML = shorterAddress(collectionItem.owner)
    eData.eOwnerAddress.title = collectionItem.owner
    eData.eOwnerAvatar.setAttribute('src', getAvatarByAddress(collectionItem.owner))

    eData.eTotalSupply.innerHTML = collectionItem.totalSupply
  }

  async CreateCollectionItemComponent(collectionItem: CollectionItem): Promise<HTMLDivElement> {
    const template = document.querySelector(PageElementId.CollectionItemTemplate)
      ?.firstElementChild as HTMLDivElement | null
    if (!template) return document.createElement('div')

    const tokenItemNode = template.cloneNode(true) as HTMLDivElement
    const eData: CollectionItemElementObject = {
      eContainer: tokenItemNode,
      eDescription: tokenItemNode.querySelector(
        `.${CollectionItemClass.Description}`,
      ) as HTMLDivElement,
      eImage: tokenItemNode.querySelector(`.${CollectionItemClass.Image}`) as HTMLImageElement,
      eTitle: tokenItemNode.querySelector(`.${CollectionItemClass.Title}`) as HTMLDivElement,
      eCollectionAddress: tokenItemNode.querySelector(
        `.${CollectionItemClass.CollectionAddress}`,
      ) as HTMLAnchorElement,
      eOwnerAddress: tokenItemNode.querySelector(
        `.${CollectionItemClass.OwnerAddress}`,
      ) as HTMLAnchorElement,
      eOwnerAvatar: tokenItemNode.querySelector(
        `.${CollectionItemClass.OwnerAvatar}`,
      ) as HTMLDivElement,
      eTotalSupply: tokenItemNode.querySelector(
        `.${CollectionItemClass.TotalSupply}`,
      ) as HTMLDivElement,
    }
    eData.eContainer.setAttribute(AttributeName.CltAddress, collectionItem.collectionAddress)
    eData.eContainer.setAttribute('href', getCollectionDetailHref(collectionItem.collectionAddress))
    eData.eTitle.innerHTML = collectionItem.name
    eData.eTitle.title = collectionItem.name
    eData.eImage.setAttribute('src', getAvatarByAddress(collectionItem.collectionAddress))
    eData.eDescription.innerHTML = collectionItem.description

    eData.eCollectionAddress.innerHTML = shorterAddress(collectionItem.collectionAddress) || ''
    eData.eCollectionAddress.title = collectionItem.collectionAddress
    eData.eCollectionAddress.setAttribute(
      'href',
      getAddressExplorerHref(collectionItem.collectionAddress),
    )

    eData.eOwnerAddress.innerHTML = shorterAddress(collectionItem.owner)
    eData.eOwnerAddress.title = collectionItem.owner
    eData.eOwnerAvatar.setAttribute('src', getAvatarByAddress(collectionItem.owner))
    eData.eTotalSupply.innerHTML = collectionItem.totalSupply

    return tokenItemNode
  }
  async clearCollectionContainer() {
    try {
      let listCollectionContainer = document.querySelector(
        PageElementId.ListCollectionContainer,
      ) as HTMLDivElement
      if (!listCollectionContainer) {
        console.log('listCollectionContainer is not exists')
        return
      }
      listCollectionContainer.innerHTML = ''
    } catch (error) {
      console.log(error)
    }
  }

  async getAllCollectionOfMarket() {
    let listCollections: CollectionItem[] = []
    let listCollectionContainer = document.querySelector(
      PageElementId.ListCollectionContainer,
    ) as HTMLDivElement

    try {
      const collections = await viewMarketCollections()
      console.log(collections)
      await Promise.all(
        collections.collectionDetails.map(
          async (collectionDetail: CollectionDetail, index: number) => {
            listCollections.push({
              collectionAddress: collections.collectionAddresses[index],
              owner: collectionDetail.creatorAddress,
              tradingFee: collectionDetail.tradingFee,
              creatorFee: collectionDetail.creatorFee,
              title: '',
              description: '',
              totalSupply: 'unknow',
              name: '',
            })
          },
        ),
      )
      if (!listCollectionContainer) {
        console.log('listCollectionContainer is not exists')
        return
      }
      await this.clearCollectionContainer()

      listCollections.forEach(async (CollectionItem: CollectionItem, index) => {
        listCollectionContainer.appendChild(
          await this.CreateCollectionItemComponent(CollectionItem),
        )
      })

      // Update
      await Promise.all(
        collections.collectionAddresses.map(async (cltAddress: string, index: number) => {
          try {
            const ownerAddress = await getOwnerOfCollection(cltAddress)
            listCollections[index].owner = ownerAddress
          } catch (error) {}
          try {
            const cltName = await getNameOfCollection(cltAddress)
            console.log({ cltName })
            listCollections[index].name = cltName
          } catch (error) {}

          try {
            const totalSupply = await getTotalSupply(cltAddress)
            listCollections[index].totalSupply = totalSupply
          } catch (error) {}
          // try {
          //   const TokenUri = await getTokenUri(cltAddress)
          //   listCollections[index].tokenUri = TokenUri
          // } catch (error) {}

          await this.UpdateCollectionItemComponent(listCollections[index])
        }),
      )

      console.log({ listCollections })
    } catch (error) {
      console.log(error)
    }
  }
}

export const ExploreCollectionPageControllerInstance = new ExploreCollectionPageController()
