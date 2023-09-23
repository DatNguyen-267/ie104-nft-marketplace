import { connect } from "../../services/common";
import { NFT_ADDRESS } from "../../constants";
import { convertWalletError } from "../../utils/errors";
const btn = document.querySelector("#btn-connect") as HTMLButtonElement;
const handleConnectWallet = () => {
  connect()
    .then((res) => {
      console.log("success");
      console.log({ walletAddress: res[0] });
    })
    .catch((err) => {
      console.log(convertWalletError(err));
    });
};

console.log({ NFT_ADDRESS });
btn.onclick = handleConnectWallet;
