import { Wallet } from "zksync-web3";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function(hre: HardhatRuntimeEnvironment) {
  console.log("Deploying the Decentralized Messaging Application Smart Contract");

  const wallet = new Wallet("Private Key");
  const deployer = new Deployer(hre, wallet);

  const artifacts = await deployer.loadArtifact("zkSyncMessagingDApp");

  const deployedContract = await deployer.deploy(artifacts);

  console.log(`${artifacts.contractName} has been deployed and its public Address is ${deployedContract.address}`)
  
  // contract deployed address is 0x04d45381653F615d34EE6dFa317f0172014058E5 
}