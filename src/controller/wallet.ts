import { getAccountAddress, getDefaultProvider, switchToNetwork } from '../services'
import { shorterAddress } from '../utils'
import { getAvatarByAddress } from '../utils/avatar'

export const showWalletInfo = async (account: string) => {
  try {
    const headerAvatar = document.getElementById('header-avatar') as HTMLElement
    const btnLogin = document.getElementById('btn-login') as HTMLButtonElement
    const userName = document.getElementById('pop-up-user-name') as HTMLElement
    const userImg = document.getElementById('header-avatar') as HTMLImageElement
    headerAvatar.style.display = 'flex'
    btnLogin.style.display = 'none'

    try {
      const address = await getAccountAddress()
        .then((res) => res)
        .catch((err) => {
          console.log(err)
        })

      userName.innerHTML = shorterAddress(account, 10) || ''
      userName.title = account
      console.log(account)
      userImg.src = getAvatarByAddress(address as string)
    } catch (error) {
      headerAvatar.style.display = 'flex'
      btnLogin.style.display = 'none'
    }
  } catch (error) {
    console.log(error)
  }
}

export const hiddenWalletInfo = () => {
  const headerAvatar = document.getElementById('header-avatar') as HTMLElement
  const btnLogin = document.getElementById('btn-login') as HTMLButtonElement
  headerAvatar.style.display = 'none'
  btnLogin.style.display = 'flex'
}

class WalletManager {
  currentAddress: string = ''

  constructor() {}

  async updateAccountAddress() {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      })

      this.currentAddress = accounts[0]
    } catch (error) {
      this.currentAddress = ''
    }
  }

  async accountChanged(accounts: any) {
    if (accounts.length > 0) {
      this.currentAddress = accounts[0]
      showWalletInfo(accounts[0])
    } else {
      this.currentAddress = ''
      hiddenWalletInfo()
    }
  }

  disconnect(e: any) {
    hiddenWalletInfo()
  }

  listener() {
    if (window && window.ethereum) {
      window.ethereum.on('accountsChanged', this.accountChanged)
    }
  }
}

export const WalletManagerInstance = new WalletManager()
