import { getAddress } from 'ethers/lib/utils'
import {
  connectAndSwitch,
  getAccountAddress,
  getAllNftOfCollection,
  getBalanceNativeToken,
  getDefaultProvider,
  getErc20Balance,
  getMetadata,
  getTokenUri,
  getUrlImage,
} from '../../services'
import { ethers } from 'ethers'
import { NATIVE_TOKEN_NAME } from '../../constants'
import { ERC20_TOKEN_SUPPORTED } from '../../constants/token'
import { NftItem } from '../../types/nft'
import {
  AttributeName,
  LoadingStatus,
  NftItemClass,
  NftItemElementObject,
  PageElementId,
} from './types'
import { shorterAddress } from '../../utils'
import { ModalSellControllerInstance } from '../../controller/modal-sell'
import { UserPopoverControllerInstance } from '../../controller/user'
import { viewAsksByCollectionAndSeller, viewMarketCollections } from '../../services/market'
import { DEFAULT_NFT_ITEM } from '../../constants/default-data'

export class AccountPageController {
  constructor() {}
  async reloadBalance() {
    this.updateBalance()
    this.updateErc20Balance()
  }

  async updateBalance() {
    const labelWalletNativeBalance = document.querySelector(
      PageElementId.LabelWalletNativeBalance,
    ) as HTMLDivElement
    try {
      const walletAddress = await getAccountAddress()
      if (!walletAddress) {
        return
      }
      const balance = await getBalanceNativeToken(walletAddress)
      if (labelWalletNativeBalance && balance) {
        labelWalletNativeBalance.innerHTML =
          ethers.utils.formatEther(balance) + ' ' + NATIVE_TOKEN_NAME
        labelWalletNativeBalance.title = ethers.utils.formatEther(balance) + ' ' + NATIVE_TOKEN_NAME
      }
    } catch (error) {}
  }

  async updateErc20Balance() {
    const walletAddress = await getAccountAddress()
    if (!walletAddress) {
      return
    }
    try {
      const labelWalletToken = document.querySelector(
        PageElementId.LabelWalletToken,
      ) as HTMLDivElement
      if (!labelWalletToken) return
      Promise.all(
        Object.keys(ERC20_TOKEN_SUPPORTED).map(async (key: string) => {
          const balance = await getErc20Balance(ERC20_TOKEN_SUPPORTED[key].address, walletAddress)
          labelWalletToken.innerHTML = `${ethers.utils.formatEther(balance)} ${
            ERC20_TOKEN_SUPPORTED[key].symbol
          }`
        }),
      )
    } catch (error) {
      console.log(error)
    }
  }

  async UpdateNftItemComponent(nftItem: NftItem): Promise<void> {
    let listNftContainer = document.querySelector(PageElementId.ListNftContainer) as HTMLDivElement
    if (!listNftContainer) {
      console.log('listNftContainer is not exists')
      return
    }
    const walletAddress = (await getAccountAddress()) || ''

    if (!nftItem) return
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
      eButtonSell: tokenItemNode.querySelector(`.${NftItemClass.ButtonSell}`) as HTMLButtonElement,
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
    eData.eUserName.innerHTML = shorterAddress(walletAddress)
    eData.eUserName.title = walletAddress
    eData.eAddressNFT.innerHTML = shorterAddress(nftItem.collectionAddress)
    eData.eAddressNFT.title = nftItem.collectionAddress
    eData.eOrderNFT.innerHTML = '#' + nftItem.tokenId.toString()

    if (nftItem.status === 'NotForSale') {
      eData.eButtonSell.style.display = 'block'
    }
  }
  async CreateNftItemComponent(nftItem: NftItem): Promise<HTMLDivElement> {
    const walletAddress = (await getAccountAddress()) || ''

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
      eButtonSell: tokenItemNode.querySelector(`.${NftItemClass.ButtonSell}`) as HTMLButtonElement,
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
    eData.eUserName.innerHTML = shorterAddress(walletAddress)
    eData.eUserName.title = walletAddress
    eData.eAddressNFT.innerHTML = shorterAddress(nftItem.collectionAddress)
    eData.eAddressNFT.title = nftItem.collectionAddress
    eData.eOrderNFT.innerHTML = '#' + nftItem.tokenId.toString()

    if (nftItem.status === 'NotForSale') {
      eData.eButtonSell.style.display = 'block'
      eData.eButtonSell.addEventListener('click', () => {
        this.handleSellNft(nftItem)
      })
    }

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

  async handleSellNft(nftItem: NftItem) {
    try {
      await connectAndSwitch()
      await UserPopoverControllerInstance.connect()
      ModalSellControllerInstance.set(nftItem)
      ModalSellControllerInstance.open()
    } catch (error) {
      console.log(error)
    }
  }

  async getAllNftOfAddress() {
    let listNfts: NftItem[] = []
    let listNftContainer = document.querySelector(PageElementId.ListNftContainer) as HTMLDivElement
    if (!listNftContainer) {
      console.log('listNftContainer is not exists')
      return
    }
    try {
      const provider = await getDefaultProvider()
    } catch (error) {
      return
    }
    const walletAddress = (await getAccountAddress()) || ''
    if (!walletAddress) {
      console.log('Wallet address is not valid')
      return
    }
    try {
      const collections = await viewMarketCollections()
      await Promise.all(
        collections.collectionAddresses.map(async (collectionAddress: string) => {
          try {
            const asksOfCollection = await viewAsksByCollectionAndSeller(
              collectionAddress,
              walletAddress,
              0,
              100,
            )
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
                })
              })
            }
          } catch (error) {
            console.log(error)
          }
        }),
      )

      await Promise.all(
        collections.collectionAddresses.map(async (collectionAddress: string) => {
          try {
            const nftsOfCollection = await getAllNftOfCollection(collectionAddress, walletAddress)
            if (nftsOfCollection && nftsOfCollection.length > 0) {
              nftsOfCollection.forEach((tokenId) => {
                const isExist = listNfts.find(
                  (item) =>
                    item.tokenId === tokenId && item.collectionAddress === collectionAddress,
                )
                if (!isExist) {
                  listNfts.push({
                    ...DEFAULT_NFT_ITEM,
                    collectionAddress: collectionAddress,
                    tokenId: tokenId,
                    status: 'NotForSale',
                    price: '0',
                  })
                }
              })
            }
          } catch (error) {
            console.log(error)
          }
        }),
      )

      // Convert the Set back to an array
      await AccountPageControllerInstance.clearNftContainer()

      listNfts.forEach(async (nftItem: NftItem, index) => {
        listNftContainer.appendChild(
          await AccountPageControllerInstance.CreateNftItemComponent(nftItem),
        )
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
            await AccountPageControllerInstance.UpdateNftItemComponent(listNfts[index])
          } catch (error) {}
        }),
      )
      console.log({ listNfts })
    } catch (error) {
      console.log(error)
    }
  }
}

export const AccountPageControllerInstance = new AccountPageController()
