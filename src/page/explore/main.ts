import "./styles.css";
import "./../../styles/base.css";
import './../../styles/grid.css';
import './../../components/avatar/styles.css';
import './../../components/header/styles.css';
import './../../components/alert/styles.css';
import './../../components/button/styles.css';
import './../../components/NFTcard/styles.css';
import './../../components/modal/modalBuyNFT/styles.css';

console.log("explore page script");

// ========================== Header =======================================
const btnLogin = document.getElementById("btn-login") as HTMLButtonElement;
const popUpUserClose = document.getElementById("close-pop-up-user") as HTMLElement;
const headerAvatar = document.getElementById("header-avatar") as HTMLElement;
const alertOverlay = document.getElementById("alert-overlay-close") as HTMLElement;
const alertCancel = document.getElementById("alert-cancel") as HTMLElement;
const alertClose = document.getElementById("alert-close") as HTMLElement;
const signOut = document.getElementById("header-sign-out") as HTMLElement;

// Check Login 
let login:boolean = true ;
if (login === true as boolean) {
    headerAvatar.style.display = 'flex';
    btnLogin.style.display = 'none';
}
else {
    headerAvatar.style.display = 'none';
    btnLogin.style.display = 'flex';
}

// Toggle PopUP 
function togglePopUpUser(event: Event): void {
    event.preventDefault();
    var x = document.getElementById("pop-up-user") as HTMLElement;
    if (x.style.visibility === "hidden") {
        x.style.visibility = "visible";
        x.style.opacity = "1";
    } else {
        x.style.visibility = "hidden";
        x.style.opacity = "0";
    }
}
popUpUserClose.onclick = togglePopUpUser;
headerAvatar.onclick = togglePopUpUser;

// Toggle Alert
const toggleAlertSigout = (event: any) => {
    event.preventDefault();
    var x = document.getElementById("alert-sigout") as HTMLElement;
    if (x.style.visibility === "hidden") {
        x.style.visibility = "visible";
    } else {
        x.style.visibility = "hidden";
    }
}
alertOverlay.onclick = toggleAlertSigout;
alertCancel.onclick = toggleAlertSigout;
alertClose.onclick = toggleAlertSigout;
signOut.onclick = toggleAlertSigout;

// ===================== NFTs ============================
const modalOverlay = document.getElementById("modal-buy-overlay-close") as HTMLElement;
const modalCancel = document.getElementById("modal-buy-cancel") as HTMLElement;
const modalClose = document.getElementById("modal-buy-close") as HTMLElement;
const nfts = document.querySelectorAll<HTMLElement>(".nft-item");

// Toggle modal nft
const toggleModalBuyNFT = (event: any) => {
    event.preventDefault();
    var x = document.getElementById("modal-buy") as HTMLElement;
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}

modalOverlay.onclick = toggleModalBuyNFT;
modalCancel.onclick = toggleModalBuyNFT;
modalClose.onclick = toggleModalBuyNFT;

// load nfts
document.addEventListener("DOMContentLoaded", () => {
    for (let i = 0; i < nfts.length; i++) {
        const btn = nfts[i].querySelector('.nft-card__btn') as HTMLButtonElement;
        btn.onclick = toggleModalBuyNFT;
    }
})