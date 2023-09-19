import { connect } from "../../services/common";
import { NFT_ADDRESS } from "../../constants";
const btn = document.querySelector("#btn-connect") as HTMLButtonElement
const handleConnectWallet = () => {
    connect().then((res)=>{
        console.log('success')
    }).catch((err)=> {
        console.log(err)
    })
}

console.log({NFT_ADDRESS})
btn.onclick = handleConnectWallet