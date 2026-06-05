import { defineConfig } from "hardhat/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers],

  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  paths: {
    sources: "./contract",
    artifacts: "./artifacts",
    cache: "./cache",
  },

  networks: {
    localhost: {
      type: "http",
      chainType: "generic",
      url: "http://127.0.0.1:8545",
    },
  },
});
