import { ethers } from "hardhat";
import fs from "fs";
import { run } from "./run";

async function main() {
  const [owner] = await ethers.getSigners();
  const ShoeStore = await ethers.getContractFactory("ShoeStore");
  const shoeStore = await ShoeStore.deploy(
    "0x0b5bdf6d8886aceea84da2fdeb15f9c7418a3cad"
  );
  await shoeStore.deployed();
  await run(shoeStore, owner.address);
  console.log(
    `shoeStore deployed to 
    ${shoeStore.address}`
  );

  const content = `export const address = "${shoeStore.address}";
export default address;
  `;
  fs.writeFileSync("../frontend/constants/address.ts", content);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
