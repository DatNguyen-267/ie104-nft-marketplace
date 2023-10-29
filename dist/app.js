/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/NFTcard/styles.css":
/*!*******************************************!*\
  !*** ./src/components/NFTcard/styles.css ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/alert/styles.css":
/*!*****************************************!*\
  !*** ./src/components/alert/styles.css ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/avatar/styles.css":
/*!******************************************!*\
  !*** ./src/components/avatar/styles.css ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/button/styles.css":
/*!******************************************!*\
  !*** ./src/components/button/styles.css ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/header/styles.css":
/*!******************************************!*\
  !*** ./src/components/header/styles.css ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/modal/modalBuyNFT/styles.css":
/*!*****************************************************!*\
  !*** ./src/components/modal/modalBuyNFT/styles.css ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/page/styles.css":
/*!*****************************!*\
  !*** ./src/page/styles.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/styles/base.css":
/*!*****************************!*\
  !*** ./src/styles/base.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/styles/grid.css":
/*!*****************************!*\
  !*** ./src/styles/grid.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src/page/app.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ "./src/page/styles.css");
/* harmony import */ var _styles_base_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../styles/base.css */ "./src/styles/base.css");
/* harmony import */ var _styles_grid_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../styles/grid.css */ "./src/styles/grid.css");
/* harmony import */ var _components_avatar_styles_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../components/avatar/styles.css */ "./src/components/avatar/styles.css");
/* harmony import */ var _components_header_styles_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../components/header/styles.css */ "./src/components/header/styles.css");
/* harmony import */ var _components_alert_styles_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../components/alert/styles.css */ "./src/components/alert/styles.css");
/* harmony import */ var _components_button_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../components/button/styles.css */ "./src/components/button/styles.css");
/* harmony import */ var _components_NFTcard_styles_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../components/NFTcard/styles.css */ "./src/components/NFTcard/styles.css");
/* harmony import */ var _components_modal_modalBuyNFT_styles_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../components/modal/modalBuyNFT/styles.css */ "./src/components/modal/modalBuyNFT/styles.css");









console.log("LP script");
// ========================== Header =======================================
var btnLogin = document.getElementById("btn-login");
var popUpUserClose = document.getElementById("close-pop-up-user");
var headerAvatar = document.getElementById("header-avatar");
var alertOverlay = document.getElementById("alert-overlay-close");
var alertCancel = document.getElementById("alert-cancel");
var alertClose = document.getElementById("alert-close");
var signOut = document.getElementById("header-sign-out");
// Check Login 
var login = false;
if (login === true) {
    headerAvatar.style.display = 'flex';
    btnLogin.style.display = 'none';
}
else {
    headerAvatar.style.display = 'none';
    btnLogin.style.display = 'flex';
}
// Toggle PopUP 
function togglePopUpUser(event) {
    event.preventDefault();
    var x = document.getElementById("pop-up-user");
    if (x.style.visibility === "hidden") {
        x.style.visibility = "visible";
        x.style.opacity = "1";
    }
    else {
        x.style.visibility = "hidden";
        x.style.opacity = "0";
    }
}
popUpUserClose.onclick = togglePopUpUser;
headerAvatar.onclick = togglePopUpUser;
// Toggle Alert
var toggleAlertSigout = function (event) {
    event.preventDefault();
    var x = document.getElementById("alert-sigout");
    if (x.style.visibility === "hidden") {
        x.style.visibility = "visible";
    }
    else {
        x.style.visibility = "hidden";
    }
};
alertOverlay.onclick = toggleAlertSigout;
alertCancel.onclick = toggleAlertSigout;
alertClose.onclick = toggleAlertSigout;
signOut.onclick = toggleAlertSigout;
// ============================= INFORMATION ====================================
// Active sroll card 
var cards = document.querySelectorAll('.cards');
var setClasses = function () {
    var classes = ['left', 'active', 'right'];
    cards.forEach(function (card, index) { return card.classList.add(classes[index]); });
};
var changePositions = function (e) {
    var clickedCard = e.currentTarget;
    var activeCard = document.querySelector('.cards.active');
    if (clickedCard.classList.contains('active'))
        return;
    var classesFrom = e.currentTarget.className;
    var classesTo = activeCard.className;
    clickedCard.className = classesTo;
    activeCard.className = classesFrom;
};
cards.forEach(function (card) {
    card
        .addEventListener('click', changePositions);
});
setClasses();
// Set image for card 
var nftEg = document.querySelectorAll('.nft-eg__content');
console.log(nftEg);
nftEg[0].style.backgroundImage = "url('https://uithcm-my.sharepoint.com/personal/19520171_ms_uit_edu_vn/Documents/IE104/image/NftEg2.png')";
nftEg[1].style.backgroundImage = "url('https://uithcm-my.sharepoint.com/personal/19520171_ms_uit_edu_vn/Documents/IE104/image/NftEg.png')";
nftEg[2].style.backgroundImage = "url('https://uithcm-my.sharepoint.com/personal/19520171_ms_uit_edu_vn/Documents/IE104/image/NftEg3.png')";
// ===================== NFTs ============================
var modalOverlay = document.getElementById("modal-buy-overlay-close");
var modalCancel = document.getElementById("modal-buy-cancel");
var modalClose = document.getElementById("modal-buy-close");
var nfts = document.querySelectorAll(".nft-item");
// Toggle modal nft
var toggleModalBuyNFT = function (event) {
    event.preventDefault();
    var x = document.getElementById("modal-buy");
    if (x.style.display === "none") {
        x.style.display = "flex";
    }
    else {
        x.style.display = "none";
    }
};
modalOverlay.onclick = toggleModalBuyNFT;
modalCancel.onclick = toggleModalBuyNFT;
modalClose.onclick = toggleModalBuyNFT;
// load nfts
document.addEventListener("DOMContentLoaded", function () {
    for (var i = 0; i < nfts.length; i++) {
        var btn = nfts[i].querySelector('.nft-card__btn');
        btn.onclick = toggleModalBuyNFT;
    }
});

})();

/******/ })()
;
//# sourceMappingURL=app.js.map