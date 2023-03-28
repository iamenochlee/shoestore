import { ethers } from "hardhat";
import fs from "fs";
import { run } from "./runCreateandList";

async function main() {
  const tokenAddress = "0x9A676e781A523b5d0C0e43731313A708CB607508";
  const [owner] = await ethers.getSigners();
  const ShoeStore = await ethers.getContractFactory("ShoeStore");
  const shoeStore = await ShoeStore.deploy(
    "0xE22C8D114e9066095d9e6716A85132cFd83Be699",
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

//0x0b5bdf6d8886aceea84da2fdeb15f9c7418a3cad
