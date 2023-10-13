import { ethers } from 'ethers'
import { AppError, NFT_ADDRESS } from '../../constants'
import { getDefaultProvider, getProvider } from '../../services'
import { connect, switchToNetwork } from '../../services/connect'
import { convertWalletError } from '../../utils/errors'
import './styles.css'

let showAccount = document.querySelector('.showAccount') as HTMLElement
let walletAddress: string

const btnSendEth = document.querySelector('#btn-sendEth') as HTMLButtonElement
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

// Send 0.01 Ether to NFT marketplace
const handleSendEth = async () => {
  window.ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: walletAddress,
          to: NFT_ADDRESS,
          value: ethers.utils.parseEther('0.001').toString(),
          // Below information customizable by the user during MetaMask confirmation.
          gasLimit: '0x5028',
          maxPriorityFeePerGas: '0x3b9aca00',
          maxFeePerGas: '0x2540be400',
        },
      ],
    })
    .then((txHash: any) => console.log(txHash))
    .catch((error: any) => console.error(error))
}

const onClickInstallMetaMask = () => {}
btnMetamask.onclick = handleConnectWallet
btnSendEth.onclick = handleSendEth
