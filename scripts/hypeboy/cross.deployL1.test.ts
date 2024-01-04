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
  { reward: "3000", max: "30" },
  { reward: "3000", max: "30" },
  { reward: "6000", max: "60" },
  { reward: "6000", max: "60" },
  { reward: "15000", max: "150" },
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
  const l1nft = L1NFT.attach("0x8128e30a472d140AdB7012CD724CE5cAa0881604");
  // const l1nft = await L1NFT.deploy("test", "TT", 10000);
  // tx = await l1nft.deployed();
  // console.log(`deployed L1 NFTs : ${tx.address}`);

  // tx = await l1nft.airdrop(l1Wallet.address, nftMintAmount);
  // await tx.wait();
  // console.log(`L1 : Nft minted ${nftMintAmount} Nfts to ${l1Wallet.address}`);
  const L1Stake = (await ethers.getContractFactory("L1NFTStakingNew")).connect(
    l1Wallet
  );
  const l1stake = L1Stake.attach("0x35Dac73268d9Ff3FdFd596A9E3CB772f7682F417");
  // const l1stake = await L1Stake.deploy(l1nft.address);
  // tx = await l1stake.deployed();
  // console.log(`deployed L1 Staking : ${tx.address}`);
  // const nonce = await l1Provider.getTransactionCount(l1Wallet.address);
  // console.log(nonce);
  // // const gasPrice = await l1Provider.getGasPrice();
  // const transaction = {
  //   to: l1Wallet.address,
  //   value: BigNumber.from("0"),
  // };
  // tx = await l1Wallet.sendTransaction({
  //   ...transaction,
  //   nonce: "0x" + nonce.toString(16),
  //   // gasPrice: ethers.utils.formatUnits("10", "gwei"),
  //   // maxFeePerGas: ethers.utils.formatUnits("20", "gwei"),
  //   // maxPriorityFeePerGas: ethers.utils.parseEther("0.0000005"),
  //   // gasLimit: ethers.utils.parseEther("0.0000005"),
  //   gasPrice: "50000000000",
  //   // maxFeePerGas: gasPrice.toNumber() * 1.5,
  //   // maxPriorityFeePerGas: gasPrice.toNumber() * 1.5,
  // });
  // await tx.wait();
  // console.log(`reset`);
  // const l1stake = L1Stake.attach("0x8F2EBb2cbDd9c80772c933c89130D072a0449DaF");
  // const nonce = await l1Provider.getTransactionCount(l1Wallet.address);
  // const l1stake = await L1Stake.deploy(l1nft.address, {
  //   nonce,
  //   gasPrice: ethers.utils.parseEther("0.0000000028"),
  // });
  // , {
  // nonce: nonce,
  // gasPrice: gasPrice.toNumber() * 1.5,
  // maxFeePerGas: gasPrice.toNumber() * 1.5,
  // });

  const L2Token = (await ethers.getContractFactory("ERC20Token")).connect(
    l2Wallet
  );
  const l2token = L2Token.attach("0xd6c1B59Fd48cd1EdAB39b981330EE148784E51F4");
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

  const L2Stake = (await ethers.getContractFactory("L2NFTStakingNew")).connect(
    l2Wallet
  );
  const l2stake = L2Stake.attach("0xfB1dFd796F6B7a65cdb5034Ff799DAC5BecAD4fe");
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

  // for (const [index, list] of lists.entries()) {
  //   const splited = splitArray(list, 50);
  //   for (const splitList of splited) {
  //     tx = await l2stake.setTokenRarityEach(splitList, index);
  //     await tx.wait();
  //   }
  // }
  // console.log(`L2 : set L2 contract's token rarity success.`);

  // for (const [index, list] of lists.entries()) {
  //   const splited = splitArray(list, 50);
  //   for (const splitList of splited) {
  //     tx = await l2stake.setTokenTimestampEach(splitList, timestampInit);
  //     await tx.wait();
  //   }
  // }
  // console.log(`L2 : set L2 contract's token timestamp success.`);

  // tx = await l2token.approve(l2stake.address, MAX_AMOUNT);
  // await tx.wait();
  // tx = await l2stake.depositReward(ethers.utils.parseEther(depositReward));
  // await tx.wait();
  // console.log(`L2 : ${depositReward} token deposited to L2 pool.`);

  const nonce2 = await l1Provider.getTransactionCount(l1Wallet.address);

  tx = await l1stake.setL2Contract(l2stake.address, {
    nonce: nonce2,
    gasPrice: ethers.utils.parseEther("0.00000013"),
  });
  await tx.wait();
  console.log(`L1 : set L2 contract address to L1 pool.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
