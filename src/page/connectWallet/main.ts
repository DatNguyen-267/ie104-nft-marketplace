import { AppError, NFT_ADDRESS } from '../../constants'
import { getDefaultProvider, getProvider } from '../../services'
import { connect, switchToNetwork } from '../../services/connect'
import { convertWalletError } from '../../utils/errors'
import './styles.css'

let showAccount = document.querySelector('.showAccount') as HTMLElement

window.onload = async () => {
  if (window.localStorage.getItem('connected')) {
    await connect().then((res) => {
      console.log({ walletAddress: res[0] })
      showAccount.innerHTML = 'Wallet address: ' + res[0]
      window.localStorage.setItem('connected', 'injected')
    })
  }
}

const btnMetamask = document.querySelector('#btn-metamask') as HTMLButtonElement
const handleConnectWallet = async () => {
  await connect()
    .then((res) => {
      console.log({ walletAddress: res[0] })
      showAccount.innerHTML = 'Wallet address: ' + res[0]
      window.localStorage.setItem('connected', 'injected')
    })
    .catch((err) => {
      if (err.message === AppError.NOT_INSTALLED_METAMASK) {
        onClickInstallMetaMask()
      }
      console.log(convertWalletError(err))
    })
  const provider = getDefaultProvider()
  if (!provider) {
    return
  }
  await switchToNetwork(provider.provider, '4102')
}

const onClickInstallMetaMask = () => {}
btnMetamask.onclick = handleConnectWallet
