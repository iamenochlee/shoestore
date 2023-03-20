import { ethers } from "hardhat";
import fs from "fs"
import {run} from "./run";

async function main() {
  const ShoeStore = await ethers.getContractFactory("ShoeStore");
  const shoeStore = await ShoeStore.deploy();
  await shoeStore.deployed();
  await run(shoeStore);
  console.log(
    `shoeStore deployed to 
    ${shoeStore.address}`,
  );

  const content = `export const address = "${shoeStore.address}";
export default address;
  `
  fs.writeFileSync("../frontend/constants/address.ts", content);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
