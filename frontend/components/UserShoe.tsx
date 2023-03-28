import React, { useState } from "react";
import { UserShoeProps } from "../types";
import { formatEther } from "ethers/lib/utils.js";
import { useContractWrite } from "wagmi";
import { abi, contractAddress } from "../constants";
import { isAdminStore } from "../store";
import { useStore } from "zustand";
import ChangePriceModal from "./ChangePriceModal";

const UserShoe = ({ shoe, refetch }: UserShoeProps) => {
  const { isAdmin } = useStore(isAdminStore);
  const [newPrice, setNewPrice] = useState(formatEther(shoe.price));
  const [isActive, setIsActive] = useState(false);

  const {
    isSuccess,
    isLoading,
    writeAsync: list,
  } = useContractWrite({
    abi,
    address: contractAddress,
    functionName: "listShoe",
    args: [shoe.id],
    mode: "recklesslyUnprepared",
  });

  const {
    isLoading: unlistIsLoading,
    isSuccess: isUnlistSuccess,
    writeAsync: delist,
  } = useContractWrite({
    abi,
    address: contractAddress,
    functionName: "delistShoe",
    args: [shoe.id],
    mode: "recklesslyUnprepared",
  });

  const toggleModal = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`column ${isAdmin ? "is-3" : "is-2"}`}>
      <div className="card is-rounded has-background-black-ter has-text-white">
        <div>
          <figure className="image is-1by1" style={{ objectFit: "cover" }}>
            <img src={shoe.image} alt={shoe.name} />
          </figure>
        </div>
        <div>
          <ul className="p-2">
            <li>Name: {shoe.name}</li>
            <li>Brand: {shoe.brand}</li>
            <li>Size: {shoe.size.toString()}</li>
            <div className="price is-flex is-align-items-center gap-2">
              <li> Price:</li>{" "}
              <span className="has-text-weight-bold mr-4">
                {formatEther(shoe.price).slice(0, 5)} MEGA
              </span>
              <button
                className="button is-small is-rounded"
                onClick={toggleModal}>
                change
              </button>
            </div>
          </ul>
          {shoe.isListed ? (
            <button
              disabled={unlistIsLoading}
              className={`button ${
                isUnlistSuccess ? "is-warning" : "is-info"
              } is-fullwidth has-text-weight-bold ${
                unlistIsLoading ? "is-loading" : ""
              }`}
              onClick={() => {
                delist().then(refetch);
              }}>
              {isUnlistSuccess ? "Delisted" : "DeList"}
            </button>
          ) : (
            <div>
              <button
                disabled={isLoading}
                className={`button ${
                  isSuccess ? "is-warning" : "is-primary"
                } is-fullwidth has-text-weight-bold ${
                  isLoading ? "is-loading" : ""
                }`}
                onClick={() => {
                  list().then(refetch);
                }}>
                {isSuccess ? "Listed" : "List"}
              </button>
            </div>
          )}
          <ChangePriceModal
            newPrice={newPrice}
            toggleModal={toggleModal}
            isActive={isActive}
            shoe={shoe}
            setNewPrice={setNewPrice}
            refetch={refetch}
          />
        </div>
      </div>
    </div>
  );
};

export default UserShoe;
