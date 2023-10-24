import "./styles.css";
import "./../styles/base.css";
import './../styles/grid.css';
import './../components/avatar/styles.css';
import './../components/header/styles.css';
import './../components/alert/styles.css';
import './../components/button/styles.css';
import './../components/NFTcard/styles.css';
import './../components/modal/modalBuyNFT/styles.css';

console.log("LP script");

// ========================== Header =======================================
const btnLogin = document.getElementById("btn-login") as HTMLButtonElement;
const popUpUserClose = document.getElementById("close-pop-up-user") as HTMLElement;
const headerAvatar = document.getElementById("header-avatar") as HTMLElement;
const alertOverlay = document.getElementById("alert-overlay-close") as HTMLElement;
const alertCancel = document.getElementById("alert-cancel") as HTMLElement;
const alertClose = document.getElementById("alert-close") as HTMLElement;
const signOut = document.getElementById("header-sign-out") as HTMLElement;

// Check Login 
let login:boolean = false ;
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

// ============================= INFORMATION ====================================

// Active sroll card 
const cards = document.querySelectorAll('.cards');
const setClasses = () => {
    const classes = ['left', 'active', 'right'];
    cards.forEach((card, index) => card.classList.add(classes[index]))
}
const changePositions = (e: any) => {
    const clickedCard = e.currentTarget;
    const activeCard = document.querySelector('.cards.active') as HTMLElement;
    if (clickedCard.classList.contains('active')) return;
    const classesFrom = e.currentTarget.className;
    const classesTo = activeCard.className;
    clickedCard.className = classesTo;
    activeCard.className = classesFrom;
}
cards.forEach((card) => {
    card
        .addEventListener('click', changePositions)
})
setClasses();

// Set image for card 
var nftEg = document.querySelectorAll<HTMLElement>('.nft-eg__content');
console.log(nftEg)
nftEg[0].style.backgroundImage = "url('https://uithcm-my.sharepoint.com/personal/19520171_ms_uit_edu_vn/Documents/IE104/image/NftEg2.png')";
nftEg[1].style.backgroundImage = "url('https://uithcm-my.sharepoint.com/personal/19520171_ms_uit_edu_vn/Documents/IE104/image/NftEg.png')";
nftEg[2].style.backgroundImage = "url('https://uithcm-my.sharepoint.com/personal/19520171_ms_uit_edu_vn/Documents/IE104/image/NftEg3.png')";

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

