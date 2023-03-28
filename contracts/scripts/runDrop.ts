import { parseEther } from "ethers/lib/utils";
import { MegaToken } from "../typechain-types";

export async function run(
  shoestore: MegaToken,
  owner: string,
  addresses: string[]
) {
  const Addresses = [owner, ...addresses];
  for (let i = 0; i < Addresses.length; i++) {
    const tx = await shoestore.transfer(Addresses[i], parseEther("100"));
    await tx.wait(1);
  }
}
