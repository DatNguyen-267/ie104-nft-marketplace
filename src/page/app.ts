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




