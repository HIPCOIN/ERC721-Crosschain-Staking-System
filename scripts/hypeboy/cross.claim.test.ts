import { ethers, upgrades } from "hardhat";
import Dotenv from "dotenv";
import moment from "moment";
import { MAX_AMOUNT } from "../utils/constant";
import { splitArray } from "../utils/common";
import { L1ToL2MessageGasEstimator } from "@arbitrum/sdk";

Dotenv.config();
const {
  ALCHEMY_URL,
  METAMASK_KEY,
  ALCHEMY_ARBITRUM_URL,
  ALCHEMY_ARBGOERLI_URL,
  ALCHEMY_GOERLI_URL,
} = process.env;

const L1gasPrice = ethers.utils.parseEther("0.000000002");

const eoa = "0xB3291Ec7b91C29C48Fe5A6755A111d7A22a8DD5A";
const claimTokenList = new Array(100).fill(null).map((_, i) => i + 1);

async function main() {
  let tx;
  const walletPrivateKey = METAMASK_KEY ?? "";

  const l1Provider = new ethers.providers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
  const l2Provider = new ethers.providers.JsonRpcProvider(
    ALCHEMY_ARBGOERLI_URL
  );
  const abi = [
    {
      inputs: [
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "claim",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const l1Wallet = new ethers.Wallet(walletPrivateKey, l1Provider);
  const l2Wallet = new ethers.Wallet(walletPrivateKey, l2Provider);

  const L1NFT = (await ethers.getContractFactory("ERC721AToken")).connect(
    l1Wallet
  );
  const l1nft = L1NFT.attach("0xcaDCa8272cf546c1E2eE2E2f5FC62F458BBEb8FE");

  const L1Stake = (await ethers.getContractFactory("L1NFTStaking")).connect(
    l1Wallet
  );
  const l1stake = L1Stake.attach("0xecf960d396aCc6C9d89D6e31579F4b48751E1E01");

  const L2Stake = (await ethers.getContractFactory("L2NFTStaking")).connect(
    l2Wallet
  );
  const l2stake = L2Stake.attach("0x5D60b57cE1B76109039E359B804460CFc24212B2");

  const gasEstimate = new L1ToL2MessageGasEstimator(l2Provider);
  const iface = new ethers.utils.Interface(abi);
  const abiEncoder = ethers.utils.defaultAbiCoder;
  const data = abiEncoder.encode(
    ["address", "uint256[]"],
    [eoa, claimTokenList]
  );
  // console.log(data);
  const calldata = iface.encodeFunctionData("claim", [data]);

  const maxSubmissionCost = await gasEstimate.estimateSubmissionFee(
    l1Provider,
    await l1Provider.getGasPrice(),
    ethers.utils.hexDataLength(calldata)
  );
  const gasPrice = await l2Provider.getGasPrice();
  console.log(gasPrice);
  const senderDeposit = ethers.utils.parseEther("0.1");

  const gasLimit = await gasEstimate.estimateRetryableTicketGasLimit(
    {
      from: l1stake.address,
      to: l2stake.address,
      l2CallValue: ethers.utils.parseEther("0"),
      excessFeeRefundAddress: eoa,
      callValueRefundAddress: eoa,
      data: calldata,
    },
    senderDeposit
    // maxSubmissionCost,
    // ethers.BigNumber.from("0"),
    // ethers.BigNumber.from("0"),
  );
  let callValue = maxSubmissionCost.add(gasPrice.mul(gasLimit));
  const value = callValue.mul(2);

  console.log(`CallValue = ${callValue.toString()}`);
  console.log(`CallValue = ${value.toString()}`);
  console.log(`MaxSubmissionCost = ${maxSubmissionCost.toString()}`);
  console.log(`gasLimit = ${gasLimit.toString()}`);

  // const nonce = await l1Provider.getTransactionCount(l1Wallet.address);
  // console.log(nonce);
  // const l1GasPrice = await l1Provider.getGasPrice();
  // const gasFee = await l1stake.estimateGas.claim(
  //   claimTokenList,
  //   maxSubmissionCost,
  //   gasLimit.mul(2),
  //   gasPrice,
  //   //   { value: callValue.toString(), gasPrice: L1gasPrice, nonce }
  //   { value: callValue }
  // );
  tx = await l1stake.claim(
    claimTokenList,
    maxSubmissionCost,
    gasLimit.mul(2).toString(),
    gasPrice.toString(),
    //   { value: callValue.toString(), gasPrice: L1gasPrice, nonce }
    { value }
  );
  // console.log(tx);
  const recipt = await tx.wait();
  console.log(recipt.logs[2].topics);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
