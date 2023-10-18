import { NftItem } from './../../types/nft'
import './styles.css'
import { ethers } from 'ethers'
import { AppError, DEFAULT_ADDRESS, NATIVE_TOKEN_NAME } from '../../constants'
import {
  connect,
  getAllNftOfCollection,
  getBalanceNativeToken,
  getDefaultProvider,
  getErc20Balance,
  getMetadata,
  getTokenUri,
  getUrlImage,
  switchToNetwork,
  watchErc20Asset,
} from '../../services'
import { ERC20_TOKEN_SUPPORTED } from './../../constants/token'
import {
  createAskOrder,
  viewAsksByCollectionAndSeller,
  viewMarketCollections,
} from '../../services/market'
// Class name compatible with the template

const defaultNftItem = {
  collectionAddress: '',
  tokenId: '',
  title: '',
  description: '',
  tokenUri: '',
  owner: '',
  status: 'Sale',
  imageUri: '',
  imageGatewayUrl: '',
  price: '0',
}
enum LoadingStatus {
  Pending = 'pending',
  Success = 'success',
  Fail = 'fail',
}
enum AttributeName {
  Loading = 'data-loading',
  TokenId = 'data-token-id',
  CltAddress = 'data-clt-address',
}
enum NftItemClass {
  Container = 'nft__container',
  Image = 'nft__img',
  Title = 'nft__title',
  Description = 'nft__description',
  Price = 'nft__price',
  Status = 'nft__status',
  MetadataUri = 'nft__metadataUri',
  ButtonSell = 'nft__button-sell',
}

type NftItemElementObject = {
  eContainer: HTMLDivElement
  eImage: HTMLImageElement
  eTitle: HTMLDivElement
  eDescription: HTMLDivElement
  ePrice: HTMLDivElement
  eStatus: HTMLDivElement
  eMetadataUri: HTMLDivElement
  eButtonSell: HTMLButtonElement
}

enum PageElementId {
  ContainerNoConnection = '#container-no-connection',
  ContainerConnected = '#container-connected',
  ButtonConnect = '#btn-connect',
  LabelWalletStatus = '#label-wallet-status',
  LabelWalletAddress = '#label-wallet-address',
  LabelWalletNativeBalance = '#label-wallet-native-balance',
  ListTokenContainer = '#list-token__container',
  ListNftContainer = '#list-nft__container',
}
var walletAddress = DEFAULT_ADDRESS
var isConnected = false
var listNfts: NftItem[] = []
document.addEventListener('DOMContentLoaded', () => {
  // ELEMENTS
  var containerNoConnection = document.querySelector(
    PageElementId.ContainerNoConnection,
  ) as HTMLDivElement
  var containerConnected = document.querySelector(
    PageElementId.ContainerConnected,
  ) as HTMLDivElement
  var btnConnect = document.querySelector(PageElementId.ButtonConnect) as HTMLButtonElement
  var labelWalletStatus = document.querySelector(PageElementId.LabelWalletStatus) as HTMLDivElement
  var labelWalletAddress = document.querySelector(
    PageElementId.LabelWalletAddress,
  ) as HTMLDivElement
  var labelWalletNativeBalance = document.querySelector(
    PageElementId.LabelWalletNativeBalance,
  ) as HTMLDivElement
  var listTokenContainer = document.querySelector(
    PageElementId.ListTokenContainer,
  ) as HTMLDivElement
  var listNftContainer = document.querySelector(PageElementId.ListNftContainer) as HTMLDivElement

  // EVENTS LISTENER
  async function handleAccountsChanged(accounts: string[]) {
    walletAddress = accounts[0]
    await updateBalance()
    await updateErc20Balance()
    await getAllNftOfAddress()
  }
  async function handleChainChanged() {
    switchToNetwork(getDefaultProvider(), '4102')
  }
  async function handleDisconnect() {
    walletAddress = DEFAULT_ADDRESS
    isConnected = false
  }
  async function listener() {
    if (isConnected && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('disconnect', handleDisconnect)
      watchErc20Asset(
        ERC20_TOKEN_SUPPORTED.WBNB.address,
        ERC20_TOKEN_SUPPORTED.WBNB.symbol,
        ERC20_TOKEN_SUPPORTED.WBNB.decimals,
      )
    }
  }

  // MAIN FUNCTION
  async function updateErc20Balance() {
    if (!walletAddress) return
    try {
      Promise.all(
        Object.keys(ERC20_TOKEN_SUPPORTED).map(async (key: string) => {
          const balance = await getErc20Balance(ERC20_TOKEN_SUPPORTED[key].address, walletAddress)

          if (listTokenContainer && balance) {
            const tokenItemNode = document.createElement('div')
            tokenItemNode.className = 'list-token__item'
            tokenItemNode.innerHTML = `${ethers.utils.formatEther(balance)} ${
              ERC20_TOKEN_SUPPORTED[key].symbol
            }`
            listTokenContainer.appendChild(tokenItemNode)
          }
        }),
      )
    } catch (error) {}
  }
  async function handleSellNft(nftItem: NftItem) {
    if (nftItem.owner.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error(AppError.OWNER_IS_NOT_VALID)
    }

    // await createAskOrder(nftItem.collectionAddress, nftItem.tokenId.toString(), nftItem.price)
  }
  async function updateBalance() {
    try {
      const balance = await getBalanceNativeToken(walletAddress)
      if (labelWalletNativeBalance && balance) {
        labelWalletNativeBalance.innerHTML =
          ethers.utils.formatEther(balance) + ' ' + NATIVE_TOKEN_NAME
      }
    } catch (error) {}
  }
  async function UpdateNftItemComponent(nftItem: NftItem): Promise<void> {
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
    }
    eData.eImage.src = nftItem.imageGatewayUrl ? nftItem.imageGatewayUrl : '#'
    eData.eContainer.setAttribute(AttributeName.TokenId, nftItem.tokenId.toString())
    eData.eContainer.setAttribute(AttributeName.CltAddress, nftItem.collectionAddress)
    eData.eTitle.innerHTML = nftItem.title
    eData.eDescription.innerHTML = nftItem.description
    eData.ePrice.innerHTML = nftItem.price
    eData.eStatus.innerHTML = nftItem.status
    eData.eMetadataUri.innerHTML = nftItem.tokenUri
    if (nftItem.status === 'NotForSale') {
      eData.eButtonSell.style.display = 'block'
    }
  }
  async function CreateNftItemComponent(nftItem: NftItem): Promise<HTMLDivElement> {
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
    }

    console.log({ imageGatewayUrl: nftItem.imageGatewayUrl })
    eData.eImage.src = nftItem.imageGatewayUrl ? nftItem.imageGatewayUrl : '#'
    eData.eContainer.setAttribute(AttributeName.TokenId, nftItem.tokenId.toString())
    eData.eContainer.setAttribute(AttributeName.CltAddress, nftItem.collectionAddress)
    eData.eContainer.setAttribute(AttributeName.Loading, LoadingStatus.Pending)

    eData.eTitle.innerHTML = nftItem.title
    eData.eDescription.innerHTML = nftItem.description
    eData.ePrice.innerHTML = nftItem.price
    eData.eStatus.innerHTML = nftItem.status
    eData.eMetadataUri.innerHTML = nftItem.tokenUri

    if (nftItem.status === 'NotForSale') {
      eData.eButtonSell.style.display = 'block'
      eData.eButtonSell.addEventListener('click', () => {
        handleSellNft(nftItem)
      })
    }

    return tokenItemNode
  }
  async function getAllNftOfAddress() {
    if (!isConnected) return
    try {
      const collections = await viewMarketCollections()
      console.log({ collections })
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
                  ...defaultNftItem,
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
                    ...defaultNftItem,
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
      console.log('create component')
      listNfts.forEach(async (nftItem: NftItem, index) => {
        listNftContainer.appendChild(await CreateNftItemComponent(nftItem))
      })

      console.log('getTokenUri')

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
            await UpdateNftItemComponent(listNfts[index])
          } catch (error) {}
        }),
      )
      console.log({ listNfts })
    } catch (error) {
      console.log(error)
    }
  }

  async function initPage() {
    try {
      if (window.ethereum && window.ethereum.isConnected()) {
        walletAddress = (await getDefaultProvider()?.getSigner().getAddress()) || DEFAULT_ADDRESS
        isConnected = true
        updateBalance()
      } else {
        await connect()
        await switchToNetwork(getDefaultProvider(), '4102')
        const provider = getDefaultProvider()
        walletAddress = (await provider?.getSigner().getAddress()) || DEFAULT_ADDRESS
        isConnected = true
        if (labelWalletAddress && labelWalletStatus) {
          labelWalletStatus.innerHTML = 'Connected'
          labelWalletAddress.innerHTML = walletAddress
          containerNoConnection.style.display = 'none'
          containerConnected.style.display = 'block'
        }
        await updateBalance()
        await updateErc20Balance()
        await getAllNftOfAddress()
      }
    } catch (error) {
      isConnected = false
    }
  }

  initPage()
  listener()
})
