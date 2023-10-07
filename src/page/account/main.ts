import { ethers } from 'ethers'
import { DEFAULT_ADDRESS, NATIVE_TOKEN_NAME } from '../../constants'
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
import { viewAsksByCollectionAndSeller, viewMarketCollections } from '../../services/market'
import { NftItem } from '../../types/nft'

enum PageElementId {
  ContainerNoConnection = '#container-no-connection',
  ContainerConnected = '#container-connected',
  ButtonConnect = '#btn-connect',
  LabelWalletStatus = '#label-wallet-status',
  LabelWalletAddress = '#label-wallet-address',
  LabelWalletNativeBalance = '#label-wallet-native-balance',
  ListTokenContainer = '#list-token__container',
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
  async function updateBalance() {
    try {
      const balance = await getBalanceNativeToken(walletAddress)
      if (labelWalletNativeBalance && balance) {
        labelWalletNativeBalance.innerHTML =
          ethers.utils.formatEther(balance) + ' ' + NATIVE_TOKEN_NAME
      }
    } catch (error) {}
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
            if (
              asksOfCollection &&
              asksOfCollection.tokenIds &&
              asksOfCollection.tokenIds.length > 0
            ) {
              asksOfCollection.tokenIds.forEach((tokenId) => {
                listNfts.push({
                  collectionAddress: collectionAddress,
                  tokenId: tokenId,
                  title: '',
                  description: '',
                  tokenUri: '',
                  owner: '',
                  status: 'Sale',
                  imageUri: '',
                  imageGatewayUrl: '',
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
                    collectionAddress: collectionAddress,
                    tokenId: tokenId,
                    title: '',
                    description: '',
                    tokenUri: '',
                    owner: '',
                    status: 'NotForSale',
                    imageUri: '',
                    imageGatewayUrl: '',
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
      console.log({ listNfts })

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
            console.log({ metadata })
            listNfts[index].title = metadata.title || ''
            listNfts[index].description = metadata.description || ''
            listNfts[index].imageUri = metadata.image || ''
            listNfts[index].imageGatewayUrl = getUrlImage(metadata.image) || ''
          } catch (error) {}
        }),
      )
      console.log(listNfts)
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
