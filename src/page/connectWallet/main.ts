import { AppError, NFT_ADDRESS } from '../../constants'
import { getDefaultProvider, getProvider } from '../../services'
import { connect, switchToNetwork } from '../../services/connect'
import { convertWalletError } from '../../utils/errors'
import './styles.css'

let showAccount = document.querySelector('.showAccount') as HTMLElement
let walletAddress: string

const btnMetamask = document.querySelector('#btn-metamask') as HTMLButtonElement
const handleConnectWallet = async () => {
  await connect()
    .then((res) => {
      console.log(res)
      walletAddress = res[0]
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

  showAccount.innerHTML = walletAddress
}

const onClickInstallMetaMask = () => {}
btnMetamask.onclick = handleConnectWallet
