import "./styles.css";
import "./../styles/base.css";
import './../styles/grid.css';
import './../components/avatar/styles.css';
import './../components/header/styles.css';
import './../components/alert/styles.css';

console.log("LP script");

// ============================= Toggle PopUP ====================================
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

var popUpUserClose = document.getElementById("close-pop-up-user") as HTMLElement;
const headerAvatar = document.getElementById("header-avatar") as HTMLElement;

popUpUserClose.onclick = togglePopUpUser;
headerAvatar.onclick = togglePopUpUser;

// ============================== Toggle Alert===================================
const toggleAlertSigout = (event: any) => {
    event.preventDefault();
    var x = document.getElementById("alert-sigout") as HTMLElement;
    if (x.style.visibility === "hidden") {
        x.style.visibility = "visible";
    } else {
        x.style.visibility = "hidden";
    }
}

var alertOverlay = document.getElementById("alert-overlay-close") as HTMLElement;
const alertCancel = document.getElementById("alert-cancel") as HTMLElement;
const alertClose = document.getElementById("alert-close") as HTMLElement;
const signOut = document.getElementById("header-sign-out") as HTMLElement;

alertOverlay.onclick = toggleAlertSigout;
alertCancel.onclick = toggleAlertSigout;
alertClose.onclick = toggleAlertSigout;
signOut.onclick = toggleAlertSigout;

// ============================= Active sroll card ====================================
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

// =========================== Set image for card ======================================
var nftEg = document.querySelectorAll<HTMLElement>('.nft-eg__content');
console.log(nftEg)
nftEg[0].style.backgroundImage = "url('https://uithcm-my.sharepoint.com/personal/19520171_ms_uit_edu_vn/Documents/IE104/image/NftEg2.png')";
nftEg[1].style.backgroundImage = "url('https://uithcm-my.sharepoint.com/personal/19520171_ms_uit_edu_vn/Documents/IE104/image/NftEg.png')";
nftEg[2].style.backgroundImage = "url('https://uithcm-my.sharepoint.com/personal/19520171_ms_uit_edu_vn/Documents/IE104/image/NftEg3.png')";

