import { ethers } from "hardhat";
import { ShoeStore } from "../typechain-types";

export async function run(shoestore: ShoeStore) {
  const owner = (await ethers.getSigners())[0];
  const images = [
    "https://gateway.pinata.cloud/ipfs/QmeqbrRRcsGykFrxNnuiZm75gCzs5q8YhwFyEU7vpUMhfD",
    "https://gateway.pinata.cloud/ipfs/QmdbssEotGGuHgfcPnHDgEcoMezjFs8BS63Zsgj43n4CCE",
    "https://gateway.pinata.cloud/ipfs/QmandiauSML764Zwxt869GSZ45JquD8HWHX9BtST9mp9EN",
    "https://gateway.pinata.cloud/ipfs/QmXSGZ5u5xMzCLdwsJk5tNKLaSWaNoMkPuvtLTA8e9cziv",
  ];
  for (let i = 1; i < 5; i++) {
    const tx = await shoestore.createShoe(
      `Jordan ${i}`,
      "Nike",
      5,
      ethers.utils.parseEther((i - 0.95).toString()),
      images[i - 1]
    );
    await tx.wait(1);
  }

  const userShoes = await shoestore.getAllUserShoes(owner.address);
  for (const shoe of userShoes) {
    if (!shoe.isListed) {
      await shoestore.listShoe(shoe.id);
    }
  }
}
