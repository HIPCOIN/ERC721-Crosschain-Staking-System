import { ethers, upgrades } from "hardhat";
import Dotenv from "dotenv";
// import lists from "./tokenList2.json";
import moment from "moment";
import { MAX_AMOUNT } from "../utils/constant";
import { splitArray } from "../utils/common";
import { BigNumber } from "ethers";

Dotenv.config();
const {
  ALCHEMY_ETHEREUM_URL,
  METAMASK_KEY,
  ALCHEMY_ARBITRUM_URL,
  ALCHEMY_ARBGOERLI_URL,
  ALCHEMY_GOERLI_URL,
} = process.env;

const rewardInfo = [
  { reward: "0", max: "0" },
  { reward: "100", max: "30" },
  { reward: "100", max: "30" },
  { reward: "200", max: "60" },
  { reward: "200", max: "60" },
  { reward: "300", max: "90" },
  { reward: "500", max: "150" },
];
const rewardInfoEmpty = [
  { reward: "0", max: "0" },
  { reward: "100", max: "0" },
  { reward: "100", max: "0" },
  { reward: "200", max: "0" },
  { reward: "200", max: "0" },
  { reward: "300", max: "0" },
  { reward: "500", max: "0" },
];
const now = moment();

const timestampInit = now.add(-5, "m").valueOf().toString().slice(0, -3);
const nftMintAmount = 100;
const tokenMintAmount = "800000000";
const depositReward = "800000000";
const tokenList = new Array(2158).fill(null).map((_, i) => i + 1);

const newTimestamp = new Date(2023, 6, 27, 15)
  .getTime()
  .toString()
  .slice(0, -3);

async function main() {
  let tx;
  const walletPrivateKey = METAMASK_KEY ?? "";

  const l1Provider = new ethers.providers.JsonRpcProvider(ALCHEMY_ETHEREUM_URL);
  const l2Provider = new ethers.providers.JsonRpcProvider(ALCHEMY_ARBITRUM_URL);

  const l1Wallet = new ethers.Wallet(walletPrivateKey, l1Provider);
  const l2Wallet = new ethers.Wallet(walletPrivateKey, l2Provider);

  const L1NFT = (await ethers.getContractFactory("ERC721AToken")).connect(
    l1Wallet
  );
  const l1nft = L1NFT.attach("0x2d26ebf5c201fc1203da3a7ed1f12fa7d0336464");
  // const l1nft = await L1NFT.deploy("test", "TT", 10000);
  // tx = await l1nft.deployed();
  // console.log(`deployed L1 NFTs : ${tx.address}`);

  // tx = await l1nft.airdrop(l1Wallet.address, nftMintAmount);
  // await tx.wait();
  // console.log(`L1 : Nft minted ${nftMintAmount} Nfts to ${l1Wallet.address}`);
  const L1Stake = (await ethers.getContractFactory("L1NFTStakingNew")).connect(
    l1Wallet
  );
  const l1stake = L1Stake.attach("0x86d526d6624AbC0178cF7296cD538Ecc080A95F1");
  // const l1stake = await L1Stake.deploy(l1nft.address);
  // tx = await l1stake.deployed();
  // console.log(`deployed L1 Staking : ${tx.address}`);

  const L2Token = (await ethers.getContractFactory("ERC20Token")).connect(
    l2Wallet
  );
  const l2token = L2Token.attach("0x2d26ebf5c201fC1203dA3a7ed1f12Fa7d0336464");
  // const l2token = await L2Token.deploy("W hypecoin", "HYC");
  // tx = await l2token.deployed();
  // console.log(`deployed L2 Tokens : ${tx.address}`);

  // tx = await l2token.mint(
  //   l2Wallet.address,
  //   ethers.utils.parseEther(tokenMintAmount)
  // );
  // await tx.wait();
  // console.log(
  //   `L2 : token minted ${tokenMintAmount} TOKEN to ${l2Wallet.address}`
  // );

  const L2Stake = (await ethers.getContractFactory("L2NFTStakingNew")).connect(
    l2Wallet
  );
  const l2stake = L2Stake.attach("0x2ca870f30b27cDD64c02801aeB2FbE549a482CEA");
  // const l2stake = await L2Stake.deploy(l2token.address);
  // tx = await l2stake.deployed();
  // console.log(`deployed L2 Staking : ${tx.address}`);

  // tx = await l2stake.setL1Contract(l1stake.address);
  // await tx.wait();
  // console.log(`L2 : set L1 contract success.`);

  // for (const [index, reward] of rewardInfo.entries()) {
  //   const _reward = ethers.utils.parseEther(reward.reward);
  //   const _max = ethers.utils.parseEther(reward.max);
  //   tx = await l2stake.setRewardInfo(index, _reward, _max);
  //   await tx.wait();
  // }
  // console.log(`L2 : set L2 contract's reward information success.`);

  // tx = await l2stake.setRewardInfo(0, 0, 0);
  // console.log("set");

  // for (const [index, list] of lists.entries()) {
  //   const splited = splitArray(list, 50);
  //   for (const splitList of splited) {
  //     tx = await l2stake.setTokenRarityEach(splitList, index + 1);
  //     await tx.wait();
  //   }
  // }
  // console.log(`L2 : set L2 contract's token rarity success.`);

  // for (const [index, list] of lists.entries()) {
  //   const splited = splitArray(list, 50);
  //   for (const splitList of splited) {
  //     tx = await l2stake.setTokenTimestampEach(splitList, newTimestamp);
  //     await tx.wait();
  //   }
  // }
  // console.log(`L2 : set L2 contract's token timestamp success.`);

  // tx = await l2token.approve(l2stake.address, MAX_AMOUNT);
  // await tx.wait();
  // tx = await l2stake.depositReward(ethers.utils.parseEther(depositReward));
  // await tx.wait();
  // console.log(`L2 : ${depositReward} token deposited to L2 pool.`);

  // const nonce2 = await l1Provider.getTransactionCount(l1Wallet.address);

  // tx = await l1stake.setL2Contract(l2stake.address, {
  //   nonce: nonce2,
  //   gasPrice: ethers.utils.parseEther("0.000000022"),
  // });
  // await tx.wait();
  // console.log(`L1 : set L2 contract address to L1 pool.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
