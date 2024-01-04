import { ethers, upgrades } from "hardhat";
import Dotenv from "dotenv";
// import lists from "./tokenList.json";
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
const depositReward = "10000";
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

  const L1NFT = (await ethers.getContractFactory("ERC721AToken")).connect(
    l1Wallet
  );
  const l1nft = L1NFT.attach("0xcaDCa8272cf546c1E2eE2E2f5FC62F458BBEb8FE");
  // const l1nft = await L1NFT.deploy("test", "TT", 10000);
  // tx = await l1nft.deployed();
  // console.log(`deployed L1 NFTs : ${tx.address}`);

  // tx = await l1nft.airdrop(l1Wallet.address, nftMintAmount);
  // await tx.wait();
  // console.log(`L1 : Nft minted ${nftMintAmount} Nfts to ${l1Wallet.address}`);
  const nonce = await l1Provider.getTransactionCount(l1Wallet.address);
  const L1gasPrice = ethers.utils.parseEther("0.000000003");
  const transaction = {
    to: l1Wallet.address,
    value: BigNumber.from("0"),
  };
  tx = await l1Wallet.sendTransaction({
    ...transaction,
    nonce: "0x" + nonce.toString(16),
    gasPrice: "50000000000",
  });
  await tx.wait();

  const L1Stake = (await ethers.getContractFactory("L1NFTStaking")).connect(
    l1Wallet
  );

  // const l1stake = L1Stake.attach("0xD46BeDFEa5F428F057Ed5a33fC2496F3a58d8F10");
  const l1stake = await L1Stake.deploy(l1nft.address);
  tx = await l1stake.deployed();
  console.log(`deployed L1 Staking : ${tx.address}`);

  const L2Token = (await ethers.getContractFactory("ERC20Token")).connect(
    l2Wallet
  );
  const l2token = L2Token.attach("0x5a19C1b44923d19E64F10bD6CE55F273C99645C6");
  // const l2token = await L2Token.deploy("hxxx", "hx");
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

  const L2Stake = (await ethers.getContractFactory("L2NFTStaking")).connect(
    l2Wallet
  );
  // const l2stake = L2Stake.attach("0x6A2E3b62D3287967843d00a330C08a2cFb0Beb14");
  const l2stake = await L2Stake.deploy(l2token.address);
  tx = await l2stake.deployed();
  console.log(`deployed L2 Staking : ${tx.address}`);

  tx = await l2stake.setL1Contract(l1stake.address);
  await tx.wait();
  console.log(`L2 : set L1 contract success.`);

  for (const [index, reward] of rewardInfo.entries()) {
    const _reward = ethers.utils.parseEther(reward.reward);
    const _max = ethers.utils.parseEther(reward.max);
    tx = await l2stake.setRewardInfo(index, _reward, _max);
    await tx.wait();
  }
  console.log(`L2 : set L2 contract's reward information success.`);

  // for (const [index, list] of lists.entries()) {
  //   const splited = splitArray(list, 200);
  //   for (const splitList of splited) {
  //     tx = await l2stake.setTokenRarityEach(splitList, index);
  //     await tx.wait();
  //   }
  // }
  console.log(`L2 : set L2 contract's token rarity success.`);

  const splited = splitArray(tokenList, 200);
  for (const list of splited) {
    tx = await l2stake.setTokenTimestampEach(list, timestampInit);
    await tx.wait();
  }
  console.log(`L2 : set L2 contract's token timestamp success.`);

  tx = await l2token.approve(l2stake.address, MAX_AMOUNT);
  await tx.wait();
  tx = await l2stake.depositReward(ethers.utils.parseEther(depositReward));
  await tx.wait();
  console.log(`L2 : ${depositReward} token deposited to L2 pool.`);

  tx = await l1stake.setL2Contract(l2stake.address);
  await tx.wait();
  console.log(`L1 : set L2 contract address to L1 pool.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
