export enum LoadingId {
  Container = 'container-loading',
  LoadingText = 'loading-text',
}

class LoadingController {
  loadingText: string | null
  constructor(_loadingText?: string) {
    this.loadingText = _loadingText || null
    this.listener()
  }

  set(_loadingText: string) {
    this.loadingText = _loadingText
    this.updateDomContent()
  }

  get() {
    return this.loadingText
  }

  updateDomContent() {
    const LoadingText = document.getElementById(LoadingId.LoadingText) as HTMLElement

    LoadingText.innerHTML = this.loadingText ? this.loadingText + '...' : 'LOADING...'
  }

  listener() {}

  close() {
    const modal = document.getElementById(LoadingId.Container) as HTMLElement
    modal.style.display = 'none'
  }

  toggle(event: any) {
    event.preventDefault()
    let modal = document.getElementById(LoadingId.Container) as HTMLElement
    if (modal.style.display === 'none') {
      modal.style.display = 'flex'
    } else {
      modal.style.display = 'none'
    }
  }

  open() {
    let modal = document.getElementById(LoadingId.Container) as HTMLElement
    modal.style.display = 'flex'
  }
}

export const LoadingControllerInstance = new LoadingController()
