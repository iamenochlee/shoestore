import { ethers } from "hardhat";
import fs from "fs";
import { run } from "./runCreateandList";

async function main() {
  const tokenAddress = "0x38B64681261C436F60566592A960160F6f8C921e";
  const [owner] = await ethers.getSigners();
  const ShoeStore = await ethers.getContractFactory("ShoeStore");
  const shoeStore = await ShoeStore.deploy(
    "0x0b5bdf6d8886aceea84da2fdeb15f9c7418a3cad",
    tokenAddress
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
