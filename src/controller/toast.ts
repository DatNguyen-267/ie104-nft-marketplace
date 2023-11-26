export enum ToastId {
  Container = 'toast-notifications',
}

export enum ToastType {
  success = 'success',
  error = 'error',
  warning = 'warning',
  info = 'info',
}

const toastDetails: { [key: string]: any } = {
  success: {
    icon: 'fa-check-circle',
  },
  error: {
    icon: 'fa-times-circle',
  },
  warning: {
    icon: 'fa-exclamation-circle',
  },
  info: {
    icon: 'fa-info-circle',
  },
}
class ToastController {
  message: string | null
  type: string | null
  constructor(_message?: string, _type?: string) {
    this.message = _message || null
    this.type = _type || ToastType.info
    this.listener()
  }

  set(_message: string, _type: string) {
    this.message = _message
    this.type = _type
  }

  get() {
    return this.message
  }

  listener() {}

  createNewToast(type?: string, icon?: string, message?: string) {
    const notifications = document.getElementById(ToastId.Container) as HTMLElement
    const toast = document.createElement('li') as HTMLElement

    toast.className = `toast toast-${type}`
    toast.innerHTML = `
    <div class="toast-column">
            <i class="fa ${icon}"></i>
            <span>${this.message}</span>
          </div>
    `
    notifications.insertBefore(toast, notifications.children[0])
    this.close(toast)
  }

  close(toast: HTMLElement) {
    toast.classList.add('remove')
    setTimeout(() => toast.remove(), 5000)
  }
  open() {
    let type = this.type ? this.type.toString() : ToastType.info
    const { icon, title } = toastDetails[type]
    this.createNewToast(type, icon, this.message?.toString())
  }
}

export const ToastControllerInstance = new ToastController()
