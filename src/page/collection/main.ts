import { UserPopoverControllerInstance } from '../../controller/user'
import { connectEarly } from '../../services'
import { ethereumAddressRegex } from '../../utils/regex'
import './styles.css'

const search = window.location.search
console.log({ search })
const collectionAddress = search.replace('?cltAddress=', '')
console.log({ collectionAddress })

if (ethereumAddressRegex.test(collectionAddress)) {
  console.log('valid')
} else {
  console.log('invalid')
}

// ========================== Header =======================================
const popUpUserClose = document.getElementById('close-pop-up-user') as HTMLElement
const headerAvatar = document.getElementById('header-avatar') as HTMLElement
const alertOverlay = document.getElementById('alert-overlay-close') as HTMLElement
const alertCancel = document.getElementById('alert-cancel') as HTMLElement
const alertClose = document.getElementById('alert-close') as HTMLElement
const signOut = document.getElementById('header-sign-out') as HTMLElement

connectEarly().then(() => {
  UserPopoverControllerInstance.isConnected.set(true)
  UserPopoverControllerInstance.isConnected.loadAvatar()
})

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