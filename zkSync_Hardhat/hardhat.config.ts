require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");

module.exports = {
  zksolc: {
    version: "1.2.1",
    compilerSource: "binary",
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",

  networks: {
    zkSyncTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "https://eth-goerli.g.alchemy.com/v2/", // Can also be the RPC URL of the network (e.g. `http>
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.16",
  },
};