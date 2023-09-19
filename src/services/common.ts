import { ethers } from "ethers";
export async function connect() {
    console.log("Hello from script tag");
    if (!window.ethereum) return
    if (typeof window.ethereum !== "undefined") {
        console.log("Metamask wallet detected");
        await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        Promise.resolve()
    } else {
        throw new Error("err")
    }
}

export async function getBalance(contractAddress:string) {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance));
    }
}
export function listenForTransactionMined(transactionResponse:any, provider:any) {
    console.log(`Mining ${transactionResponse.hash}...`);
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt:any) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            );
        });
        Promise.resolve();
    });
}
