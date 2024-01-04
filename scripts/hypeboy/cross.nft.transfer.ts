import { ethers, upgrades } from "hardhat";
import Dotenv from "dotenv";
import moment from "moment";
import { BigNumber } from "ethers";

Dotenv.config();
const {
  ALCHEMY_URL,
  METAMASK_KEY,
  ALCHEMY_ARBITRUM_URL,
  ALCHEMY_ARBGOERLI_URL,
  ALCHEMY_GOERLI_URL,
} = process.env;

const nftMintAmount = 100;
const to = "0xfcCb76765c0281b855BcAc04ca0970f38E45d440";

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

  tx = await l1nft.airdrop(to, nftMintAmount);
  await tx.wait();
  console.log(`L1 : Nft minted ${nftMintAmount} Nfts to ${to}`);
  const transaction = {
    to: to,
    value: ethers.utils.parseEther("0.5"),
  };
  tx = await l1Wallet.sendTransaction({
    ...transaction,
  });
  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
