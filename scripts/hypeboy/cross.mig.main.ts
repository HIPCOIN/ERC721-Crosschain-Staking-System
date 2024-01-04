import { ethers, upgrades } from "hardhat";
import Dotenv from "dotenv";
import lists from "./tokenList.json";
import moment from "moment";
import { MAX_AMOUNT } from "../utils/constant";
import { splitArray } from "../utils/common";
import { BigNumber } from "ethers";
import fs from "fs";

Dotenv.config();
const {
  ALCHEMY_ETHEREUM_URL,
  ALCHEMY_URL,
  METAMASK_KEY,
  ALCHEMY_ARBITRUM_URL,
  ALCHEMY_ARBGOERLI_URL,
  ALCHEMY_GOERLI_URL,
} = process.env;

async function main() {
  let tx;
  const walletPrivateKey = METAMASK_KEY ?? "";

  const l1Provider = new ethers.providers.JsonRpcProvider(ALCHEMY_ETHEREUM_URL);

  const l2Provider = new ethers.providers.JsonRpcProvider(ALCHEMY_ARBITRUM_URL);

  const l1Wallet = new ethers.Wallet(walletPrivateKey, l1Provider);
  const l2Wallet = new ethers.Wallet(walletPrivateKey, l2Provider);

  const L2Stake = (await ethers.getContractFactory("L2NFTStakingNew")).connect(
    l2Wallet
  );
  const l2stake = L2Stake.attach("0x2ca870f30b27cDD64c02801aeB2FbE549a482CEA");

  const L1Mig = (
    await ethers.getContractFactory("L1NFTStakingNewForMig")
  ).connect(l1Wallet);

  // const l1mig = await L1Mig.deploy(
  //   "0x2d26ebf5c201fc1203da3a7ed1f12fa7d0336464"
  // );
  // await l1mig.deployed();
  // console.log(`deployed : ${l1mig.address}`);

  const l1mig = L1Mig.attach("0x5D5248c66a79d10CFd4f2FeBC996ED6EFA2641CB");

  const L2Mig = (await ethers.getContractFactory("L2NFTStakingForMig")).connect(
    l2Wallet
  );

  const l2mig = L2Mig.attach("0x65eeC1911bb686eF4Cc7F61A2E819f83728B5D51");

  // tx = await l1mig.claimable([1], "0x8ef12188e158e1fa27711556A256F1B70c715757");
  // console.log(tx);

  // const l2mig = await L2Mig.deploy(
  //   "0x2ca870f30b27cDD64c02801aeB2FbE549a482CEA"
  // );
  // await l2mig.deployed();
  // console.log(`deployed : ${l2mig.address}`);

  // tx = await l2stake.claimable([1, 2, 3]);
  const originalArray = new Array(5555).fill(null).map((_, i) => i + 1);

  const splitArrays: number[][] = [];
  for (let i = 0; i < originalArray.length; i += 500) {
    splitArrays.push(originalArray.slice(i, i + 500));
  }

  // console.log(splitArrays);
  type Result = {
    tokenId: number;
    rarity: number;
    timestamp: number;
  };
  const result: Result[] = [];

  let tokenId = 1;
  for (const arr of splitArrays) {
    tx = await l2mig.getVault(arr);
    tx.forEach((x) => {
      result.push({ tokenId, timestamp: x.timestamp, rarity: x.rarity });
      return tokenId++;
    });
  }

  // for (const arr of splitArrays) {
  //   tx = await l2stake.claimableEach(arr);
  //   const temp = tx.map((x) => {
  //     return {
  //       tokenId: x.tokenId,
  //       claimable: parseFloat(ethers.utils.formatEther(x.claimable)),
  //     };
  //   });
  //   temp.forEach((x) => result.push(x));
  // }
  fs.writeFile("data.json", JSON.stringify(result, null, 2), "utf-8", (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("done");
    }
  });
  // tx = await l2stake.claimableEach(splitArrays[0]);
  // console.log(tx);

  // tx = await l2token.approve(l2stake.address, MAX_AMOUNT);
  // await tx.wait();
  // tx = await l2stake.depositReward(ethers.utils.parseEther(depositReward));
  // await tx.wait();
  // console.log(`L2 : ${depositReward} token deposited to L2 pool.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
