import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MegaToken } from "../typechain-types";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("MegaToken", function () {
  let token: MegaToken,
    owner: SignerWithAddress,
    addr1: SignerWithAddress,
    addr2: SignerWithAddress;

  const supply = 1_000_000;
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const MegaToken = await ethers.getContractFactory("MegaToken");
    token = await MegaToken.deploy(supply);
  });

  describe("Deployments", () => {
    it("should set the name and symbol correctly", async function () {
      expect(await token.name()).to.equal("MegaToken");
      expect(await token.symbol()).to.equal("MEGA");
    });

    it("Should have 1 million tokens", async function () {
      expect(await token.totalSupply()).to.equal(parseEther(supply.toString()));
    });
  });

  describe("Transfers", () => {
    it("Should transfer tokens", async function () {
      await expect(token.transfer(addr1.address, 1000)).to.changeTokenBalances(
        token,
        [owner, addr1],
        [-1000, 1000]
      );
      await expect(token.transfer(addr2.address, 500)).to.changeTokenBalances(
        token,
        [owner, addr2],
        [-500, 500]
      );
      expect(await token.balanceOf(addr1.address)).to.equal(1000);
      expect(await token.balanceOf(addr2.address)).to.equal(500);
    });
  });

  describe("Approvals and TransferFrom", () => {
    const amount = parseEther("2");
    let balanceBefore: BigNumber;
    beforeEach(async () => {
      balanceBefore = await token.balanceOf(owner.address);
      await token.approve(addr1.address, amount);
    });

    it("Should update the allowances", async () => {
      expect(await token.allowance(owner.address, addr1.address)).to.equal(
        amount
      );
    });

    it("Should allow the transfer of the tokens", async () => {
      const amount = parseEther("2");
      await token
        .connect(addr1)
        .transferFrom(owner.address, addr1.address, amount);
      const balanceAfter = await token.balanceOf(owner.address);
      expect(balanceAfter).to.equal(balanceBefore.sub(amount));
      expect(await token.balanceOf(addr1.address)).to.equal(amount);
    });
  });
});
