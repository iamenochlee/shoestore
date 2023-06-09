import { ethers } from "hardhat";
import { expect } from "chai";
import { MegaToken, ShoeStore } from "../typechain-types";
import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { run as runDrop } from "../scripts/runDrop";

describe("ShoeStore", function () {
  let shoeStore: ShoeStore,
    owner: SignerWithAddress,
    buyer: any,
    admin: any,
    token: MegaToken;
  beforeEach(async function () {
    [owner, admin, buyer] = await ethers.getSigners();
    const MegaToken = await ethers.getContractFactory("MegaToken");
    token = await MegaToken.deploy(1000000);
    await runDrop(token, owner.address, [
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    ]);

    const ShoeStore = await ethers.getContractFactory("ShoeStore");
    shoeStore = await ShoeStore.deploy(admin.address, token.address);
    await shoeStore.deployed();
  });

  describe("deployments", function () {
    it("sets the admins correctly", async () => {
      expect(await shoeStore.admins(owner.address)).to.equal(true);
      expect(await shoeStore.admins(admin.address)).to.equal(true);
      expect(await shoeStore.admins(buyer.address)).to.equal(false);
    });
    it("sets the commission rate correctly", async () => {
      expect(await shoeStore.commissionRate()).to.equal(1);
    });

    it("sets MEGA Token address correctly", async () => {
      expect(await shoeStore.token()).to.equal(token.address);
    });
  });

  describe("createShoe", function () {
    let tx1: TransactionResponse, tx2: TransactionResponse;
    beforeEach(async () => {
      tx1 = await shoeStore.createShoe(
        "Jordan 1",
        "Nike",
        10,
        ethers.utils.parseEther("1"),
        "https://example.com/image.jpg"
      );
      tx2 = await shoeStore
        .connect(admin)
        .createShoe(
          "Jordan 2",
          "Nike",
          5,
          ethers.utils.parseEther("2"),
          "https://example.com/image.jpg"
        );
    });
    it("should allow admins to create a new shoe", async function () {
      const shoe = await shoeStore.shoes(0);
      expect(shoe.name).to.equal("Jordan 1");
      expect(shoe.size).to.equal(10);
      expect(shoe.price).to.equal(ethers.utils.parseEther("1"));
      expect(shoe.owner).to.equal(owner.address);
      const shoe2 = await shoeStore.shoes(1);
      expect(shoe2.name).to.equal("Jordan 2");
      expect(shoe2.size).to.equal(5);
      expect(shoe2.price).to.equal(ethers.utils.parseEther("2"));
      expect(shoe2.owner).to.equal(admin.address);
    });
    it("should update the admin history", async () => {
      const ownerHistory = await shoeStore.getUserHistory(owner.address);
      expect(ownerHistory.length).to.equal(1);
      expect(ownerHistory[0].txType).to.equal("create");
    });
    it("should emits event on shoe creation", async () => {
      await expect(tx1).to.emit(shoeStore, "ShoeCreated");
      await expect(tx2).to.emit(shoeStore, "ShoeCreated");
    });
    it("should revert if a user(non-admin) is trying to create a shoe", async () => {
      await expect(
        shoeStore
          .connect(buyer)
          .createShoe(
            "Jordan 3",
            "Nike",
            5,
            ethers.utils.parseEther("3"),
            "https://example.com/image.jpg"
          )
      ).to.be.revertedWith("You are not Permitted");
    });
  });

  describe("getShoesByOwner", function () {
    const products = [
      {
        name: "Jordan 1",
        brand: "Nike",
        size: 10,
        price: 1,
        image: "https://example.com/image.jpg",
      },
      {
        name: "Air Force 1",
        brand: "Nike",
        size: 9,
        price: 2,
        image: "https://example.com/image.jpg",
      },
    ];
    beforeEach(async function () {
      for (const product of products) {
        await shoeStore.createShoe(
          product.name,
          product.brand,
          product.size,
          ethers.utils.parseEther(product.price.toString()),
          product.image
        );
      }
    });

    it("should return all shoes owned by an owner", async function () {
      const ownerShoes = await shoeStore.getAllUserShoes(owner.address);
      expect(ownerShoes).to.have.lengthOf(products.length);
      for (let i = 0; i < ownerShoes.length; i++) {
        expect(ownerShoes[i].name).to.equal(products[i].name);
        expect(ownerShoes[i].brand).to.equal(products[i].brand);
        expect(ownerShoes[i].image).to.equal(products[i].image);
      }
    });

    it("should return an empty array for an owner with no shoes", async function () {
      const buyerShoes = await shoeStore.getAllUserShoes(buyer.address);
      expect(buyerShoes).to.have.lengthOf(0);
    });
  });
  describe("list and delist shoe", function () {
    let tx1: TransactionResponse;
    const details = {
      name: "Jordan 1",
      brand: "Nike",
      size: 10,
      price: ethers.utils.parseEther("1"),
      image: "https://example.com/image.jpg",
    };
    beforeEach(async function () {
      await shoeStore.createShoe(
        details.name,
        details.brand,
        details.size,
        details.price,
        details.image
      );
      tx1 = await shoeStore.listShoe(0);
    });

    it("should update listed shoes", async function () {
      const listedShoes = await shoeStore.getAllListedShoes();
      expect(listedShoes.length).to.equal(1);
    });
    it("should emits event on shoe listing", async () => {
      await expect(tx1).to.emit(shoeStore, "ShoeListed");
    });
    it("should allow the owner to list a shoe for sale", async function () {
      const listedShoe = await shoeStore.shoes(0);
      expect(listedShoe.price).to.equal(ethers.utils.parseEther("1"));
    });
    it("should not allow the owner to relist a listed shoe for sale", async function () {
      await expect(shoeStore.listShoe(0)).to.be.revertedWith(
        "Shoe is already listed"
      );
    });

    it("should revert if a non-owner is trying to list a shoe for sale", async function () {
      await expect(shoeStore.connect(buyer).listShoe(0)).to.be.revertedWith(
        "You do not own this shoe"
      );
    });
    it("should allow the owner to change the price of the shoe", async function () {
      const newPrice = ethers.utils.parseEther("5");
      await shoeStore.changeShoePrice(0, newPrice);
      const shoe = await shoeStore.shoes(0);
      expect(shoe.price).to.equal(newPrice);
    });
    it("should allow a owner to delist a shoe listing", async function () {
      const tx2 = await shoeStore.delistShoe(0);
      const listedShoes = await shoeStore.getAllListedShoes();
      expect(listedShoes.length).to.equal(0);
      it("should emits event on shoe listing", async () => {
        await expect(tx2).to.emit(shoeStore, "ShoeDelisted").withArgs(0);
      });
    });
  });
  describe("buyShoe", function () {
    let tx: TransactionResponse, beforeBalance: BigNumber;
    const price = ethers.utils.parseEther("1");
    beforeEach(async function () {
      await shoeStore.createShoe(
        "Jordan 1",
        "Nike",
        10,
        price,
        "https://example.com/image.jpg"
      );
      beforeBalance = await token.balanceOf(owner.address);
      await shoeStore.connect(owner).listShoe(0);
      await token.connect(buyer).approve(shoeStore.address, price);
      tx = await shoeStore.connect(buyer).buyShoe(0);
    });
    it("should send the tokens to the seller", async () => {
      const afterBalance = await token.balanceOf(owner.address);
      const commission = price.mul(BigNumber.from(1)).div(BigNumber.from(100));
      const amountToSeller = price.sub(commission);

      expect(afterBalance).to.equal(beforeBalance.add(amountToSeller));
    });
    it("should update the users history", async () => {
      const ownerHistory = await shoeStore.getUserHistory(owner.address);
      const buyerHistory = await shoeStore.getUserHistory(buyer.address);

      expect(ownerHistory.length).to.equal(2);
      expect(buyerHistory.length).to.equal(1);
      expect(ownerHistory[1].txType).to.equal("sold");
      expect(buyerHistory[0].txType).to.equal("bought");
    });
    it("should transfer shoe ownership to the buyer", async () => {
      const shoeOwner = await shoeStore.shoes(0);
      const shoes = await shoeStore.getAllListedShoes();
      expect(shoes.length).to.equal(0);

      expect(shoeOwner.owner).to.equal(buyer.address);
    });
    it("should emits event on shoe purchase", async () => {
      await expect(tx)
        .to.emit(shoeStore, "ShoeBought")
        .withArgs(0, buyer.address, owner.address, price);
    });
    it("(widthrawing): should transfer the balance to the admin", async () => {
      const balance = await token.balanceOf(shoeStore.address);
      await expect(shoeStore.withdraw()).to.changeTokenBalance(
        token,
        owner,
        balance
      );
      expect(await token.balanceOf(shoeStore.address)).to.equal(0);
    });
  });
});
