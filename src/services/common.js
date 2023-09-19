import { ethers, providers } from "./ethers-5.2.esm.min.js";

async function connect() {
    console.log("Hello from script tag");
    if (typeof window.ethereum !== "undefined") {
        console.log("Metamask wallet detected");
        await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        connectButton.innerHTML = "Connected!!!";
    } else {
        connectButton.innerHTML = "Please install Metamask!!!";
    }
}

async function getBalance(contractAddress) {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance));
    }
}
function listenForTransactionMined(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            );
        });
        resolve();
    });
}
