import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

async function drop() {
  const owner = (await ethers.getSigners())[0];
  await owner.sendTransaction({
    to: "0xE22C8D114e9066095d9e6716A85132cFd83Be699",
    value: parseEther("3"),
  });
  console.log("success");
}

drop().catch(console.error);
