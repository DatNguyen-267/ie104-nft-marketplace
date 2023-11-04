import { viewAsksByCollection, viewMarketCollections } from '../services/market'
import {
  connect,
  getDefaultProvider,
  getMetadata,
  getTokenUri,
  getUrlImage,
  switchToNetwork,
} from '../services'
import { NftItem } from '../types/nft'
import { shorterAddress } from '../utils/common'
import './../components/NFTcard/styles.css'
import './../components/alert/styles.css'
import './../components/avatar/styles.css'
import './../components/button/styles.css'
import './../components/header/styles.css'
import './../components/modal/modalBuyNFT/styles.css'
import './../components/modal/modalSellNFT/styles.css'
import './../styles/base.css'
import './../styles/grid.css'
import './styles.css'

var walletAddress: string = ''
var isConnected = false
var listNfts: NftItem[] = []

enum PageElementId {
  ContainerNoConnection = '#container-no-connection',
  ContainerConnected = '#container-connected',
  ButtonConnect = '#btn-connect',
  ListNftContainer = '#list-nft__container',
}

enum HeroCardItemClass {
  content = 'nft-eg__content',
  //   info= 'nft-eg__info'
  //   name= 'nft-eg__name'
  //   user= 'nft-eg__user'
}

type NftItemElementObject = {
  eContainer: HTMLDivElement
  eImage: HTMLImageElement
  eTitle: HTMLDivElement
  eDescription: HTMLDivElement
  ePrice: HTMLDivElement
  eStatus: HTMLDivElement
  eMetadataUri: HTMLDivElement
  eButtonBuy: HTMLButtonElement
  eUserName: HTMLDivElement
  eAddressNFT: HTMLDivElement
  eOrderNFT: HTMLDivElement
}

enum NftItemClass {
  Container = 'nft__container',
  Image = 'nft__img',
  Title = 'nft__title',
  Description = 'nft__description',
  Price = 'nft__price',
  Status = 'nft__status',
  MetadataUri = 'nft__metadataUri',
  ButtonBuy = 'nft__button-buy',
  UserName = 'nft__user-name',
  AddressNFT = 'nft__address',
  OrderNFT = 'nft__order',
}
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

var walletAddress = ''
var listNft: NftItem[] = []
var listNftHero: NftItem[] = []
var listNftReview: NftItem[] = []

// ========================== Header =======================================
const btnLogin = document.getElementById('btn-login') as HTMLButtonElement
const popUpUserClose = document.getElementById('close-pop-up-user') as HTMLElement
const headerAvatar = document.getElementById('header-avatar') as HTMLElement
const alertOverlay = document.getElementById('alert-overlay-close') as HTMLElement
const alertCancel = document.getElementById('alert-cancel') as HTMLElement
const alertClose = document.getElementById('alert-close') as HTMLElement
const signOut = document.getElementById('header-sign-out') as HTMLElement

// Check Login
let login: boolean = false
if (login === (true as boolean)) {
  headerAvatar.style.display = 'flex'
  btnLogin.style.display = 'none'
} else {
  headerAvatar.style.display = 'none'
  btnLogin.style.display = 'flex'
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

// ============================= INFORMATION ====================================

// Active sroll card
const cards = document.querySelectorAll('.cards')
const setClasses = () => {
  const classes = ['left', 'active', 'right']
  cards.forEach((card, index) => card.classList.add(classes[index]))
}
const changePositions = (e: any) => {
  const clickedCard = e.currentTarget
  const activeCard = document.querySelector('.cards.active') as HTMLElement
  if (clickedCard.classList.contains('active')) return
  const classesFrom = e.currentTarget.className
  const classesTo = activeCard.className
  clickedCard.className = classesTo
  activeCard.className = classesFrom
}
cards.forEach((card) => {
  card.addEventListener('click', changePositions)
})
setClasses()

// Set image for card
var nftEg = document.querySelectorAll<HTMLElement>('.nft-eg__content')
console.log(nftEg)
nftEg[0].style.backgroundImage =
  "url('https://uithcm-my.sharepoint.com/personal/19520171_ms_uit_edu_vn/Documents/IE104/image/NftEg2.png')"
nftEg[1].style.backgroundImage =
  "url('https://uithcm-my.sharepoint.com/personal/19520171_ms_uit_edu_vn/Documents/IE104/image/NftEg.png')"
nftEg[2].style.backgroundImage =
  "url('https://uithcm-my.sharepoint.com/personal/19520171_ms_uit_edu_vn/Documents/IE104/image/NftEg3.png')"

// ===================== NFTs ============================
const modalBuyOverlay = document.getElementById('modal-buy-overlay-close') as HTMLElement
const modalBuyCancel = document.getElementById('modal-buy-cancel') as HTMLElement
const modalBuyClose = document.getElementById('modal-buy-close') as HTMLElement

const modalSellOverlay = document.getElementById('modal-sell-overlay-close') as HTMLElement
const modalSellCancel = document.getElementById('modal-sell-cancel') as HTMLElement
const modalSellClose = document.getElementById('modal-sell-close') as HTMLElement

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
  console.log('modal-buy:')
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
  console.log('modal-sell:')
  var x = document.getElementById('modal-sell') as HTMLElement
  x.style.display = 'flex'
}

modalSellOverlay.onclick = toggleModalSellNFT
modalSellCancel.onclick = toggleModalSellNFT
modalSellClose.onclick = toggleModalSellNFT

// ******************* DOM LOADED ***********************
document.addEventListener('DOMContentLoaded', () => {
  var listNftContainer = document.querySelector(PageElementId.ListNftContainer) as HTMLDivElement
  async function handleBuyNft(nftItem: NftItem) {
    try {
      await connect()
      await switchToNetwork(getDefaultProvider(), '4102')
      walletAddress = (await getDefaultProvider()?.getSigner().getAddress()) || ''
      loadAvatarLogin(true, walletAddress)

      try {
        // open modal buy nft
        openModalBuyNFT()
      } catch (error) {}
    } catch (error) {}
  }
  async function handleConnectWallet() {
    try {
      await connect()
      await switchToNetwork(getDefaultProvider(), '4102')
    } catch (error) {}
  }

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
    // if (walletAddress) {
    //   userName.innerHTML = shorterAddress(walletAddress, 10) || ''
    //   userName.title = walletAddress
    // } else {
    //   userName.innerHTML = 'User Name'
    //   userName.title = ''
    // }
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
    eData.ePrice.innerHTML = nftItem.price
    eData.ePrice.title = nftItem.price
    eData.eStatus.innerHTML = nftItem.status
    eData.eMetadataUri.innerHTML = nftItem.tokenUri
    eData.eUserName.innerHTML = shorterAddress(walletAddress) || ''
    eData.eUserName.title = walletAddress || ''
    eData.eAddressNFT.innerHTML = shorterAddress(nftItem.collectionAddress) || ''
    eData.eAddressNFT.title = nftItem.collectionAddress
    eData.eOrderNFT.innerHTML = '#' + nftItem.tokenId.toString()

    eData.eButtonBuy.style.display = 'block'
    eData.eButtonBuy.addEventListener('click', () => {
      handleBuyNft(nftItem)
    })
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

    eData.eTitle.innerHTML = nftItem.title
    eData.eTitle.title = nftItem.title
    eData.ePrice.innerHTML = nftItem.price
    eData.ePrice.title = nftItem.price
    eData.eStatus.innerHTML = nftItem.status
    eData.eMetadataUri.innerHTML = nftItem.tokenUri
    eData.eUserName.innerHTML = shorterAddress(walletAddress) || ''
    eData.eUserName.title = walletAddress
    eData.eAddressNFT.innerHTML = shorterAddress(nftItem.collectionAddress) || ''
    eData.eAddressNFT.title = nftItem.collectionAddress
    eData.eOrderNFT.innerHTML = '#' + nftItem.tokenId.toString()

    eData.eButtonBuy.style.display = 'block'
    eData.eButtonBuy.addEventListener('click', () => {
      handleBuyNft(nftItem)
    })

    return tokenItemNode
  }
  async function getAllNftOfMarket() {
    if (!isConnected) return
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

      // Convert the Set back to an array
      console.log('create component')
      listNftReview = listNfts.slice(0, 3)

      listNftReview.forEach(async (nftItem: NftItem, index) => {
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

            if (listNftReview[index]) {
              await UpdateNftItemComponent(listNftReview[index])
            }
          } catch (error) {}
        }),
      )
    } catch (error) {
      console.log(error)
    }
  }

  async function initPage() {
    try {
      try {
        // await connect()
        // walletAddress = (await getDefaultProvider()?.getSigner().getAddress()) || ''
        // loadAvatarLogin(true, walletAddress)
      } catch (error) {}

      // isConnected = true
      // const provider = getDefaultProvider()
      // walletAddress = (await provider?.getSigner().getAddress()) || ''
      // isConnected = true
      await getAllNftOfMarket()
    } catch (error) {
      // isConnected = false
      // loadAvatarLogin(false, undefined)
    }
  }

  initPage()
})
