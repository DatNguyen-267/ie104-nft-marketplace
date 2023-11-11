import { ModalBuyControllerInstance } from '../../controller/modal-buy'
import { UserPopoverControllerInstance } from '../../controller/user'
import { connectAndSwitch, getMetadata, getTokenUri, getUrlImage } from '../../services'
import { viewAsksByCollection, viewMarketCollections } from '../../services/market'
import { CollectionItem } from '../../types/collection'
import { shorterAddress } from '../../utils'
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
      `div[data-clt-address="${collectionItem.collectionAddress}"]`,
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
      ) as HTMLDivElement,
      eOwner: tokenItemNode.querySelector(`.${CollectionItemClass.Owner}`) as HTMLDivElement,
    }
    eData.eContainer.setAttribute(AttributeName.CltAddress, collectionItem.collectionAddress)
    eData.eTitle.innerHTML = collectionItem.title
    eData.eTitle.title = collectionItem.title
    eData.eDescription.innerHTML = collectionItem.description

    eData.eCollectionAddress.innerHTML = shorterAddress(collectionItem.collectionAddress) || ''
    eData.eCollectionAddress.title = collectionItem.collectionAddress
    eData.eOwner.innerHTML = '#' + collectionItem.owner
  }

  async CreateCollectionItemComponent(collectionItem: CollectionItem): Promise<HTMLDivElement> {
    const template = document.querySelector('#Collection-template')
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
      ) as HTMLDivElement,
      eOwner: tokenItemNode.querySelector(`.${CollectionItemClass.Owner}`) as HTMLDivElement,
    }
    eData.eContainer.setAttribute(AttributeName.CltAddress, collectionItem.collectionAddress)
    eData.eTitle.innerHTML = collectionItem.title
    eData.eTitle.title = collectionItem.title
    eData.eDescription.innerHTML = collectionItem.description

    eData.eCollectionAddress.innerHTML = shorterAddress(collectionItem.collectionAddress) || ''
    eData.eCollectionAddress.title = collectionItem.collectionAddress
    eData.eOwner.innerHTML = '#' + collectionItem.owner.toString()

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
        collections.collectionAddresses.map(async (collectionAddress: string) => {
          listCollections.push({
            collectionAddress: '',
            owner: '',
            title: '',
            description: '',
          })
        }),
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
    } catch (error) {
      console.log(error)
    }
  }
}

export const ExploreCollectionPageControllerInstance = new ExploreCollectionPageController()
