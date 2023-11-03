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
  UserName = 'nft__user-name',
  AddressNFT = 'nft__address',
  OrderNFT = 'nft__order',
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
  eUserName: HTMLDivElement
  eAddressNFT: HTMLDivElement
  eOrderNFT: HTMLDivElement
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
var walletAddress = ''
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
    initPage()
    // await updateBalance()
    // await updateErc20Balance()
    // await getAllNftOfAddress()
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
      // initPage()

      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('accountsChanged', handleAccountsChanged)
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
            tokenItemNode.title = `${ethers.utils.formatEther(balance)} ${
              ERC20_TOKEN_SUPPORTED[key].symbol
            }`
            listTokenContainer.appendChild(tokenItemNode)
          }
        }),
      )
    } catch (error) {}
  }
  async function handleSellNft(nftItem: NftItem) {
    // open sell modal
    openModalSellNFT();
    // await createAskOrder(nftItem.collectionAddress, nftItem.tokenId.toString(), nftItem.price)
  }
  async function updateBalance() {
    try {
      const balance = await getBalanceNativeToken(walletAddress)
      if (labelWalletNativeBalance && balance) {
        labelWalletNativeBalance.innerHTML =
          ethers.utils.formatEther(balance) + ' ' + NATIVE_TOKEN_NAME
        labelWalletNativeBalance.title = ethers.utils.formatEther(balance) + ' ' + NATIVE_TOKEN_NAME
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
    eData.eUserName.innerHTML = shortString(walletAddress)
    eData.eUserName.title = walletAddress
    eData.eAddressNFT.innerHTML = shortString(nftItem.collectionAddress)
    eData.eAddressNFT.title = nftItem.collectionAddress
    eData.eOrderNFT.innerHTML = '#' + nftItem.tokenId.toString()

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
    eData.eUserName.innerHTML = shortString(walletAddress)
    eData.eUserName.title = walletAddress
    eData.eAddressNFT.innerHTML = shortString(nftItem.collectionAddress)
    eData.eAddressNFT.title = nftItem.collectionAddress
    eData.eOrderNFT.innerHTML = '#' + nftItem.tokenId.toString()

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
        await switchToNetwork(getDefaultProvider(), '4102')
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
          labelWalletStatus.classList.add('wallet__status--connected')
          labelWalletAddress.innerHTML = shortString(walletAddress)
          labelWalletAddress.title = walletAddress
          containerNoConnection.style.display = 'none'
          containerConnected.style.display = 'block'

          // show or hide avatar when login for header
          loadAvatarLogin(true, walletAddress)
        }
        await updateBalance()
        await updateErc20Balance()
        await getAllNftOfAddress()
      }
    } catch (error) {
      isConnected = false
      // show or hide avatar when login for header
      loadAvatarLogin(false, undefined)
    }
  }

  async function handleConnectWallet() {
    try {
      await connect()
      await switchToNetwork(getDefaultProvider(), '4102')
    } catch (error) {}
  }

  try {
    initPage()
    listener()
  } catch (error) {
    console.log(error)
  }

  btnConnect.onclick = handleConnectWallet
})

// ============================ Short String =====================================
const shortString = (string: string): string => {
  if (string.length > 9) {
    var shortenedString = string.substring(0, 5) + ' ... ' + string.substring(string.length - 4)
    return shortenedString
  }
  return string
}

const shortPrice = (string: string): string => {
  if (string.length > 12) {
    var shortenedString = string.substring(0, 7) + ' ... ' + string.substring(string.length - 5)
    return shortenedString
  }
  return string
}

// ============================ Header =====================================
const btnLogin = document.getElementById('btn-login') as HTMLButtonElement
const popUpUserClose = document.getElementById('close-pop-up-user') as HTMLElement
const headerAvatar = document.getElementById('header-avatar') as HTMLElement
const alertOverlay = document.getElementById('alert-overlay-close') as HTMLElement
const alertCancel = document.getElementById('alert-cancel') as HTMLElement
const alertClose = document.getElementById('alert-close') as HTMLElement
const signOut = document.getElementById('header-sign-out') as HTMLElement

// show or hide avatar when login for header
function loadAvatarLogin(login: boolean, walletAddress: string | undefined) {
  // show or hide avatar
  if (login === (true as boolean)) {
    headerAvatar.style.display = 'flex'
    btnLogin.style.display = 'none'
  } else {
    headerAvatar.style.display = 'none'
    btnLogin.style.display = 'flex'
  }

  // load wallet address
  const userName = document.getElementById('pop-up-user-name') as HTMLElement
  if (walletAddress) {
    userName.innerHTML = shortString(walletAddress)
    userName.title = walletAddress
  } else {
    userName.innerHTML = 'User Name'
    userName.title = ''
  }
}

// Toggle PopUP
function togglePopUpUser(event: Event): void {
  event.preventDefault()
  var x = document.getElementById('pop-up-user') as HTMLElement
  if (x.style.visibility === 'hidden') {
    x.style.visibility = 'visible'
    x.style.opacity = '1'
  } else {
    x.style.visibility = 'hidden'
    x.style.opacity = '0'
  }
}

popUpUserClose.onclick = togglePopUpUser
headerAvatar.onclick = togglePopUpUser

// Toggle Alert
const toggleAlertSigout = (event: any) => {
  event.preventDefault()
  var x = document.getElementById('alert-sigout') as HTMLElement
  if (x.style.visibility === 'hidden') {
    x.style.visibility = 'visible'
  } else {
    x.style.visibility = 'hidden'
  }
}

alertOverlay.onclick = toggleAlertSigout
alertCancel.onclick = toggleAlertSigout
alertClose.onclick = toggleAlertSigout
signOut.onclick = toggleAlertSigout

// ============================ Catergory NFT =====================================
var catergoryBtns = document.querySelectorAll<HTMLButtonElement>('.catergory-btn')

const handleResetBtn = (number: number) => {
  for (var i = 0; i < catergoryBtns.length; i++) {
    catergoryBtns[i].style.backgroundColor = 'var(--color-white)'
    catergoryBtns[i].style.color = 'var(--color-primary)'
  }
  catergoryBtns[number].style.backgroundColor = 'var(--color-primary)'
  catergoryBtns[number].style.color = 'var(--color-white)'
}

const handleLoadNFTSale = () => {
  handleResetBtn(1)
  const nfts = document.querySelectorAll<HTMLElement>('.nft-item')

  if (nfts) {
    for (let i = 0; i < nfts.length; i++) {
      var status: String | undefined = nfts[i].querySelector('.nft__status')?.innerHTML
      if (status != undefined && status != 'Sale') {
        nfts[i].style.display = 'none'
      } else {
        nfts[i].style.display = 'flex'
      }
    }
  }
}
const handleLoadNFTNotSale = () => {
  handleResetBtn(2)
  const nfts = document.querySelectorAll<HTMLElement>('.nft-item')

  if (nfts) {
    for (let i = 0; i < nfts.length; i++) {
      var status: String | undefined = nfts[i].querySelector('.nft__status')?.innerHTML
      if (status != undefined && status == 'Sale') {
        nfts[i].style.display = 'none'
      } else {
        nfts[i].style.display = 'flex'
      }
    }
  }
}
const handleLoadNFTAll = () => {
  handleResetBtn(0)
  const nfts = document.querySelectorAll<HTMLElement>('.nft-item')

  if (nfts) {
    for (let i = 0; i < nfts.length; i++) {
      nfts[i].style.display = 'flex'
    }
  }
}

if (catergoryBtns.length > 0) {
  catergoryBtns[0].onclick = handleLoadNFTAll
  catergoryBtns[1].onclick = handleLoadNFTSale
  catergoryBtns[2].onclick = handleLoadNFTNotSale
}

// ============================ Toggle Modal NFT =====================================
const modalBuyOverlay = document.getElementById('modal-buy-overlay-close') as HTMLElement
const modalBuyCancel = document.getElementById('modal-buy-cancel') as HTMLElement
const modalBuyClose = document.getElementById('modal-buy-close') as HTMLElement

const modalSellOverlay = document.getElementById('modal-sell-overlay-close') as HTMLElement
const modalSellCancel = document.getElementById('modal-sell-cancel') as HTMLElement
const modalSellClose = document.getElementById('modal-sell-close') as HTMLElement
const modalSellPrice = document.getElementById('modal-sell-price') as HTMLInputElement
const modalSellRarible = document.getElementById('modal-sell-rarible') as HTMLElement;
const modalSellTotal = document.getElementById('modal-sell-total') as HTMLElement;

// Toggle buy modal nft
const toggleModalBuyNFT = (event: any) => {
  event.preventDefault()
  var x = document.getElementById('modal-buy') as HTMLElement
  if (x.style.display === 'none') {
    x.style.display = 'flex'
  } else {
    x.style.display = 'none'
  }
}

const openModalBuyNFT = () => {
  console.log("modal-buy:")
  var x = document.getElementById('modal-buy') as HTMLElement
  x.style.display = 'flex'
}

modalBuyOverlay.onclick = toggleModalBuyNFT
modalBuyCancel.onclick = toggleModalBuyNFT
modalBuyClose.onclick = toggleModalBuyNFT


// Toggle sell modal
const toggleModalSellNFT = (event: any) => {
  event.preventDefault()
  var x = document.getElementById('modal-sell') as HTMLElement
  if (x.style.display === 'none') {
    x.style.display = 'flex'
  } else {
    x.style.display = 'none'
  }
}
const openModalSellNFT = () => {
  console.log("modal-sell:")
  var x = document.getElementById('modal-sell') as HTMLElement
  x.style.display = 'flex'
}

modalSellOverlay.onclick = toggleModalSellNFT
modalSellCancel.onclick = toggleModalSellNFT
modalSellClose.onclick = toggleModalSellNFT

 // Validate 
 function validate() {
  if (!Number(modalSellPrice.value) || modalSellPrice.value == undefined) {
    modalSellPrice.classList.add("modal-input-error");
    return false;
  }
  else {
    modalSellPrice.classList.remove("modal-input-error");
  }
  return true;
}

// total modalpSellPrice
function totalPrice() {
  if (validate()) {
    var x = Number(modalSellPrice.value);
    var y = Number(modalSellRarible.innerHTML);
    modalSellTotal.innerHTML = (x + (x * y / 100)).toString();
    modalSellTotal.title = modalSellTotal.innerHTML + ' NFT'
  }

}

modalSellPrice.onchange = totalPrice;
modalSellPrice.onblur = totalPrice;
modalSellTotal.title = modalSellTotal .innerHTML + ' NFT'

