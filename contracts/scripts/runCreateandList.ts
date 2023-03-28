import { ethers } from "hardhat";
import { ShoeStore } from "../typechain-types";

export async function run(shoestore: ShoeStore, owner: string) {
  const details = [
    {
      image:
        "https://gateway.pinata.cloud/ipfs/QmeqbrRRcsGykFrxNnuiZm75gCzs5q8YhwFyEU7vpUMhfD",
      name: "Jordan 1",
      brand: "Nike",
      price: "0.4",
      size: 12,
    },
    {
      image:
        "https://gateway.pinata.cloud/ipfs/QmdbssEotGGuHgfcPnHDgEcoMezjFs8BS63Zsgj43n4CCE",
      name: "Adidas NMD R1",
      brand: "Addidas",
      price: "5",
      size: 15,
    },
    {
      image:
        "https://gateway.pinata.cloud/ipfs/QmandiauSML764Zwxt869GSZ45JquD8HWHX9BtST9mp9EN",
      name: "Fresh Foam X",
      brand: "New Balance",
      price: "9",
      size: 10,
    },
    {
      image:
        "https://gateway.pinata.cloud/ipfs/QmXSGZ5u5xMzCLdwsJk5tNKLaSWaNoMkPuvtLTA8e9cziv",
      name: "Puma-180",
      brand: "Puma",
      price: "0.1",
      size: 20,
    },
    {
      image:
        "https://gateway.pinata.cloud/ipfs/QmVky4wTyzAhBMidMqkxY9Bga4CjaNVTivztWq5kaYqds3",
      name: "Fendi Wears",
      brand: "Fendi",
      price: "500.3",
      size: 20,
    },
  ];
  for (let i = 0; i < details.length; i++) {
    const tx = await shoestore.createShoe(
      details[i].name,
      details[i].brand,
      details[i].size,
      ethers.utils.parseEther(details[i].price),
      details[i].image
    );
    await tx.wait(1);
  }

  const userShoes = await shoestore.getAllUserShoes(owner);
  for (const shoe of userShoes) {
    if (!shoe.isListed) {
      await shoestore.listShoe(shoe.id);
    }
  }
}
