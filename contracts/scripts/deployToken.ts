import { ethers } from "hardhat";
import { run } from "./runDrop";
import fs from "fs";

async function main() {
  const owner = (await ethers.getSigners())[0];
  const MegaToken = await ethers.getContractFactory("MegaToken");
  const megatoken = await MegaToken.deploy(1000000);
  console.log("Success", megatoken.address);
  await run(megatoken, owner.address, [
    "0xF64A6f4db076B17bc11a38Ef14A3e1D8dC05c27f",
    "0xE22C8D114e9066095d9e6716A85132cFd83Be699",
    "0x0b5bdf6d8886aceea84da2fdeb15f9c7418a3cad",
  ]);

  const content = `export const tokenAddress = "${megatoken.address}";
export default tokenAddress;
  `;
  fs.writeFileSync("../frontend/constants/tokenAddress.ts", content);
  console.log("Airdropped!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
