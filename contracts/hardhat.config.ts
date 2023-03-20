import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-abi-exporter";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  defaultNetwork: "localhost",
  solidity: "0.8.18",
  abiExporter: {
    path: "../frontend/constants",
    runOnCompile: true,
    clear: true,
    flat: true,
    only: ["ShoeStore"],
    spacing: 2,
    format: "json",
  },
  networks: {
    goerli: {
      accounts: [process.env.PRIVATE_KEY || ""],
      url: process.env.GOERLI_RPC_URL || "",
    },
  },
};

export default config;
