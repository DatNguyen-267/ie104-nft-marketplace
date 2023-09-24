import { BigNumber, ethers } from "ethers";
import { WBNB_ADDRESS } from "../constants";
import { getErc20Balance } from "../services";
import "./styles.css";

console.log("LP script");
getErc20Balance(
  WBNB_ADDRESS,
  "0x454574C8AD9706a8fC22dDA71Ce77Cb1CDd5fEB1"
).then((res) => {
  console.log(res);
  console.log(BigNumber.from(res).toString());
  console.log(ethers.utils.formatEther(BigNumber.from(res).toString()));
});

console.log();
