export enum ModalSendNFTId {
  Container = 'modal-send',
  ButtonAccept = 'modal-send-ok',
  ButtonClose = 'modal-send-close',
  ButtonCancel = 'modal-send-cancel',
  OverlayClose = 'modal-send-overlay-close',
  FromAddress = 'modal-send-from',
  ToAddress = 'modal-send-to',
  TokenID = 'modal-send-token',
}

class ModalSendController {
  constructor() {
    this.listener()
  }

  set() {}

  get() {}

  updateDomContent() {}

  listener() {
    const modalButtonAccept = document.getElementById(
      ModalSendNFTId.ButtonAccept,
    ) as HTMLButtonElement

    const ModalSendCancel = document.getElementById(ModalSendNFTId.ButtonCancel) as HTMLElement
    const ModalSendClose = document.getElementById(ModalSendNFTId.ButtonClose) as HTMLElement
    const modalOverlayClose = document.getElementById(ModalSendNFTId.OverlayClose) as HTMLElement

    ModalSendClose.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    ModalSendCancel.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    modalOverlayClose.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
  }

  close() {
    const modal = document.getElementById(ModalSendNFTId.Container) as HTMLElement
    modal.style.display = 'none'
  }

  toggle(event: any) {
    event.preventDefault()
    let modal = document.getElementById(ModalSendNFTId.Container) as HTMLElement
    console.log(modal)
    console.log(modal.style.display === 'none')
    if (modal.style.display === 'none') {
      modal.style.display = 'flex'
    } else {
      modal.style.display = 'none'
    }
  }

  open() {
    console.log('open desposit')
    let modal = document.getElementById(ModalSendNFTId.Container) as HTMLElement
    modal.style.display = 'flex'
  }
}

export const ModalSendControllerInstance = new ModalSendController()
