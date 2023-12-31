import { AppError } from '../../constants'
import { CHAINS } from '../../constants/chains'
import { ToastControllerInstance, ToastType } from '../../controller/toast'
import { showWalletInfo } from '../../controller/wallet'
import { getDefaultProvider } from '../../services'
import { connect, switchToNetwork } from '../../services/connect'
import { convertWalletError } from '../../utils/errors'
import './styles.css'

let showAccount = document.querySelector('.showAccount') as HTMLElement

const btnMetamask = document.querySelector('#btn-metamask') as HTMLButtonElement

const handleConnectWallet = async () => {
  try {
    await connect()
      .then(async (res) => {
        showAccount.innerHTML = shortString(res[0])
        showAccount.title = res[0]
        window.localStorage.setItem('connected', 'injected')
        showWalletInfo(res[0].currentAddress)
        const provider = getDefaultProvider()
        if (!provider) {
          return
        }
        try {
          await switchToNetwork(provider.provider, CHAINS[0].chainId)
        } catch (error: any) {}
      })
      .catch((err: any) => {
        if (err.message === AppError.NOT_INSTALLED_METAMASK) {
          window.open('https://metamask.io/download.html', '_blank')
        }
        ToastControllerInstance.set(err.message, ToastType.error)
        ToastControllerInstance.open()
      })
  } catch (error: any) {}
}

const onClickInstallMetaMask = () => {}
btnMetamask.onclick = handleConnectWallet

// ============================ Short String =====================================
const shortString = (string: string): string => {
  if (string && string.length > 9) {
    var shortenedString = string.substring(0, 5) + ' ... ' + string.substring(string.length - 4)
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

// Check login

function checkLogin(login: boolean, walletAddress: any) {
  if (login === (true as boolean)) {
    headerAvatar.style.display = 'flex'
    btnLogin.style.display = 'none'
  } else {
    headerAvatar.style.display = 'none'
    btnLogin.style.display = 'flex'
  }
  if (walletAddress !== undefined) {
    const userName = document.getElementById('pop-up-user-name') as HTMLElement
    userName.innerHTML = shortString(walletAddress)
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

// hide pop up when resize
window.addEventListener('resize', () => {
  var w = window.innerWidth
  if (w <= 880) {
    var x = document.getElementById('pop-up-user') as HTMLElement
    if (x) {
      x.style.visibility = 'hidden'
      x.style.opacity = '0'
    }
  }
})
