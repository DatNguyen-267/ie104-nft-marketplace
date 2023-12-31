import { shorterAddress } from '../utils'
import {
  connect as handleConnect,
  getAccountAddress,
  isConnectedWallet,
  WalletSupported,
} from '../services'

// Instance userPopoverController
// ? when call <connect> can auto update isConnected, walletAddress
export class userPopoverController {
  isAvailableConnect: {
    value: boolean
    set: (value: boolean) => void
    get: () => boolean
  }
  isConnected: {
    value: boolean
    getOnChange: () => void
    set: (value: boolean) => void
    get: () => boolean
    loadAvatar: () => void
  }
  walletAddress: {
    value: string
    set: (value: string) => void
    get: () => Promise<string>
  }

  constructor() {
    this.walletAddress = {
      value: '',
      get: async function () {
        const address = (await getAccountAddress()) || ''
        this.value = address
        return address
      },
      set: function (value: string) {
        this.value = value
      },
    }
    this.isAvailableConnect = {
      value: false,

      set: function (value: boolean) {
        this.value = value
      },
      get: function () {
        const isConnected = isConnectedWallet(WalletSupported.Metamask)
        this.set(isConnected)
        return isConnected
      },
    }

    this.isConnected = {
      value: false,
      getOnChange: async function () {},
      set: function (value: boolean) {
        this.value = value
        this.getOnChange()
      },
      get: function () {
        return this.value
      },
      async loadAvatar() {
        const headerAvatar = document.getElementById('header-avatar') as HTMLElement
        const btnLogin = document.getElementById('btn-login') as HTMLButtonElement

        if (this.get()) {
          headerAvatar.style.display = 'flex'
          btnLogin.style.display = 'none'
        } else {
          headerAvatar.style.display = 'none'
          btnLogin.style.display = 'flex'
        }

        const walletAddress = await getAccountAddress()
        const userName = document.getElementById('pop-up-user-name') as HTMLElement
        if (walletAddress) {
          userName.innerHTML = shorterAddress(walletAddress, 10) || ''
          userName.title = walletAddress
        }
      },
    }
    this.listener()
  }

  async connect() {
    try {
      this.isConnected.set(true)
      await this.walletAddress.get()
    } catch (error) {
      this.isConnected.set(false)
      this.walletAddress.set('')
    }
  }

  disconnect() {
    try {
      this.isConnected.set(false)
      this.walletAddress.set('')
    } catch (error) {}
  }

  accountChanged(accounts: string[]) {
    try {
      if (accounts && accounts.length > 0) {
        this.isConnected.set(true)
        this.walletAddress.get()
      } else {
        this.disconnect()
      }
    } catch (error) {}
  }

  listener() {
    try {
    } catch (error) {}
  }
}

export const UserPopoverControllerInstance = new userPopoverController()
