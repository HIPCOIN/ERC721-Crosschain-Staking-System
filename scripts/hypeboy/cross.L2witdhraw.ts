import { ethers, upgrades } from "hardhat";
import Dotenv from "dotenv";
import moment from "moment";
import { BigNumber } from "ethers";

Dotenv.config();
const {
  ALCHEMY_ETHEREUM_URL,
  METAMASK_KEY,
  ALCHEMY_ARBITRUM_URL,
  ALCHEMY_ARBGOERLI_URL,
  ALCHEMY_GOERLI_URL,
} = process.env;

async function main() {
  let tx;
  const walletPrivateKey = METAMASK_KEY ?? "";

  const l2Provider = new ethers.providers.JsonRpcProvider(ALCHEMY_ARBITRUM_URL);

  const l2Wallet = new ethers.Wallet(walletPrivateKey, l2Provider);

  const L2Token = (await ethers.getContractFactory("ERC20Token")).connect(
    l2Wallet
  );
  const l2token = L2Token.attach("0x2d26ebf5c201fC1203dA3a7ed1f12Fa7d0336464");

  const L2Stake = (await ethers.getContractFactory("L2NFTStakingNew")).connect(
    l2Wallet
  );
  const l2stake = L2Stake.attach("0x2ca870f30b27cDD64c02801aeB2FbE549a482CEA");

  (await l2stake.withdrawReward(ethers.utils.parseEther("1000000"))).wait();

  (
    await l2token.transfer(
      "0x5e98Fe5118e9331fDa3ac3A033272C00912Ed7F8",
      ethers.utils.parseEther("1000000")
    )
  ).wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
