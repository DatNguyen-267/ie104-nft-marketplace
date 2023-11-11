import { DEFAULT_ADDRESS } from '../../constants'
import { connectEarly, getDefaultProvider, switchToNetwork } from '../../services'
import './styles.css'
// Class name compatible with the template
import { LoadingControllerInstance } from '../../controller/loading'
import { ModalDepositControllerInstance } from '../../controller/modal-deposit'
import { ModalImportControllerInstance } from '../../controller/modal-import'
import { ModalSellControllerInstance, ModalSellNFTId } from '../../controller/modal-sell'
import { UserPopoverControllerInstance } from '../../controller/user'
import { AccountPageControllerInstance } from './controller'
import { PageElementId } from './types'
import { shorterAddress } from '../../utils'

document.addEventListener('DOMContentLoaded', () => {
  let containerNoConnection = document.querySelector(
    PageElementId.ContainerNoConnection,
  ) as HTMLDivElement
  let containerConnected = document.querySelector(
    PageElementId.ContainerConnected,
  ) as HTMLDivElement
  let labelWalletStatus = document.querySelector(PageElementId.LabelWalletStatus) as HTMLDivElement
  let labelWalletAddress = document.querySelector(
    PageElementId.LabelWalletAddress,
  ) as HTMLDivElement

  async function handleAccountsChanged(accounts: string[]) {
    initPage()
  }

  async function handleChainChanged() {
    switchToNetwork(getDefaultProvider(), '4102')
  }

  async function handleDisconnect() {
    containerNoConnection.style.display = 'flex'
  }

  async function listener() {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('disconnect', handleDisconnect)
      // watchErc20Asset(
      //   ERC20_TOKEN_SUPPORTED.WBNB.address,
      //   ERC20_TOKEN_SUPPORTED.WBNB.symbol,
      //   ERC20_TOKEN_SUPPORTED.WBNB.decimals,
      // )
    }
  }

  // MAIN FUNCTION

  async function initPage() {
    try {
      connectEarly()
      UserPopoverControllerInstance.isConnected.set(true)
      UserPopoverControllerInstance.isConnected.loadAvatar()

      const provider = getDefaultProvider()
      const walletAddress = (await provider?.getSigner().getAddress()) || DEFAULT_ADDRESS
      if (labelWalletAddress && labelWalletStatus) {
        labelWalletStatus.innerHTML = 'Connected'
        labelWalletStatus.classList.add('wallet__status--connected')
        labelWalletAddress.innerHTML = shorterAddress(walletAddress)
        labelWalletAddress.title = walletAddress
        containerNoConnection.style.display = 'none'
        containerConnected.style.display = 'block'
        loadAvatarLogin(true, walletAddress)
        loadAvatarLogin(true, walletAddress)
        loadAvatarLogin(true, walletAddress)
      }
      await AccountPageControllerInstance.updateBalance()
      await AccountPageControllerInstance.updateErc20Balance()
      await AccountPageControllerInstance.getAllNftOfAddress()
    } catch (error) {
      containerNoConnection.style.display = 'flex'
      loadAvatarLogin(false, undefined)
    }
  }

  try {
    initPage()
    listener()
  } catch (error) {
    console.log(error)
  }
})

const modalButtonAccept = document.getElementById(ModalSellNFTId.ButtonAccept) as HTMLButtonElement
modalButtonAccept.addEventListener('click', (e) => {
  LoadingControllerInstance.open()
  ModalSellControllerInstance.sell()
    .then((res) => {
      AccountPageControllerInstance.getAllNftOfAddress()
    })
    .finally(() => {
      LoadingControllerInstance.close()
    })
})

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
    userName.innerHTML = shorterAddress(walletAddress)
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
      var col = nfts[i].parentElement as HTMLElement
      if (status != undefined && status != 'Sale') {
        col.style.display = 'none'
      } else {
        col.style.display = 'flex'
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
      var col = nfts[i].parentElement as HTMLElement
      if (status != undefined && status == 'Sale') {
        col.style.display = 'none'
      } else {
        col.style.display = 'flex'
      }
    }
  }
}
const handleLoadNFTAll = () => {
  handleResetBtn(0)
  console.log('abc')
  const nfts = document.querySelectorAll<HTMLElement>('.nft-item')

  if (nfts) {
    for (let i = 0; i < nfts.length; i++) {
      var col = nfts[i].parentElement as HTMLElement
      col.style.display = 'flex'
    }
  }
}

if (catergoryBtns.length > 0) {
  catergoryBtns[0].onclick = handleLoadNFTAll
  catergoryBtns[1].onclick = handleLoadNFTSale
  catergoryBtns[2].onclick = handleLoadNFTNotSale
}

// ============================ Toggle Modal NFT =====================================

const btnDeposit = document.getElementById('btn-deposit') as HTMLButtonElement
const btnImport = document.getElementById('btn-import') as HTMLButtonElement

if (btnDeposit) {
  btnDeposit.addEventListener('click', (e) => {
    console.log('Deposit clicked')
    ModalDepositControllerInstance.open()
  })
}

if (btnImport) {
  btnImport.addEventListener('click', (e) => {
    console.log('Import clicked')
    ModalImportControllerInstance.open()
  })
}
