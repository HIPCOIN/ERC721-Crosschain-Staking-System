import { ethers, upgrades } from "hardhat";
import Dotenv from "dotenv";
import moment from "moment";
import { MAX_AMOUNT } from "../utils/constant";
import { splitArray } from "../utils/common";
import { BigNumber } from "ethers";

Dotenv.config();
const {
  ALCHEMY_URL,
  METAMASK_KEY,
  ALCHEMY_ARBITRUM_URL,
  ALCHEMY_ARBGOERLI_URL,
  ALCHEMY_GOERLI_URL,
} = process.env;

const rewardInfo = [
  { reward: "10000", max: "100" },
  { reward: "20000", max: "200" },
  { reward: "30000", max: "300" },
  { reward: "40000", max: "400" },
  { reward: "50000", max: "500" },
];
const now = moment();

const timestampInit = now.add(-5, "m").valueOf().toString().slice(0, -3);
const nftMintAmount = 100;
const tokenMintAmount = "1000000";
const depositReward = "100000";
const tokenList = new Array(2158).fill(null).map((_, i) => i + 1);

async function main() {
  let tx;
  const walletPrivateKey = METAMASK_KEY ?? "";

  const l1Provider = new ethers.providers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
  const l2Provider = new ethers.providers.JsonRpcProvider(
    ALCHEMY_ARBGOERLI_URL
  );

  const l1Wallet = new ethers.Wallet(walletPrivateKey, l1Provider);
  const l2Wallet = new ethers.Wallet(walletPrivateKey, l2Provider);

  const L2Token = (await ethers.getContractFactory("ERC20Token")).connect(
    l2Wallet
  );
  const l2token = L2Token.attach("0x5a19C1b44923d19E64F10bD6CE55F273C99645C6");

  const L2Stake = (await ethers.getContractFactory("L2NFTStaking")).connect(
    l2Wallet
  );
  const l2stake = L2Stake.attach("0x5D60b57cE1B76109039E359B804460CFc24212B2");

  tx = await l2token.approve(l2stake.address, MAX_AMOUNT);
  await tx.wait();
  tx = await l2stake.depositReward(ethers.utils.parseEther(depositReward));
  await tx.wait();
  console.log(`L2 : ${depositReward} token deposited to L2 pool.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
