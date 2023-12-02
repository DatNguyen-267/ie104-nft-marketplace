import { AppError } from '../../constants'
import { CHAINS } from '../../constants/chains'
import { ChainManagerInstance } from '../../controller/chain'
import { UserPopoverControllerInstance } from '../../controller/user'
import { WalletManagerInstance, showWalletInfo } from '../../controller/wallet'
import { getDefaultProvider } from '../../services'
import { connect, connectEarly, switchToNetwork } from '../../services/connect'
import { convertWalletError } from '../../utils/errors'
import './styles.css'

let showAccount = document.querySelector('.showAccount') as HTMLElement

const btnGoerli = document.querySelector('#btn-goerli') as HTMLButtonElement
const btnAioz = document.querySelector('#btn-aioz') as HTMLButtonElement

const currentChainId = localStorage.getItem('chainId')
if (currentChainId) {
  if (currentChainId === CHAINS[0].chainId.toString()) {
    btnAioz.classList.add('active')
    btnGoerli.classList.remove('active')
  } else {
    btnGoerli.classList.add('active')
    btnAioz.classList.remove('active')
  }
}

window.ethereum?.on('chainChanged', (chainId: string) => {
  ChainManagerInstance.updateChainId(chainId)
  if (chainId) {
    if (chainId === CHAINS[0].chainIdHex.toString()) {
      btnAioz.classList.add('active')
      btnGoerli.classList.remove('active')
    } else {
      btnGoerli.classList.add('active')
      btnAioz.classList.remove('active')
    }
  }
})
const onSwitchChain = async (chainId: number) => {
  try {
    await connect()
      .then((res) => {
        showAccount.innerHTML = shortString(res[0])
        showAccount.title = res[0]
        window.localStorage.setItem('connected', 'injected')
        showWalletInfo(res[0].currentAddress)

        // check login
      })
      .catch((err) => {
        if (err.message === AppError.NOT_INSTALLED_METAMASK) {
          window.open('https://metamask.io/download.html', '_blank')
        }
        console.log(convertWalletError(err))
      })
    const provider = getDefaultProvider()
    if (!provider) {
      return
    }
    try {
      await switchToNetwork(provider.provider, chainId)
    } catch (error) {}
  } catch (error) {}
}

btnAioz.onclick = () => {
  onSwitchChain(CHAINS[0].chainId)
}
btnGoerli.onclick = () => {
  onSwitchChain(CHAINS[1].chainId)
}

connectEarly()
  .then(() => {
    UserPopoverControllerInstance.isConnected.set(true)
    UserPopoverControllerInstance.isConnected.loadAvatar()
    showWalletInfo(WalletManagerInstance.currentAddress)
  })
  .catch((err) => {
    console.log(err)
  })

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
