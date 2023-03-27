import React from "react";
import { formatEther } from "ethers/lib/utils.js";
import type { ListedShoeProps } from "../types";
import { useAccount, useContractWrite } from "wagmi";
import { abi, contractAddress } from "../constants";
import { useStore } from "zustand";
import { isAdminStore, refchTransactionsStore } from "../store";

const ListedShoe = ({ shoe, refetch }: ListedShoeProps) => {
  const { isConnected, address } = useAccount();
  const { refetch: refetchTxs } = useStore(refchTransactionsStore);
  const { isAdmin } = useStore(isAdminStore);

  const {
    isLoading,
    writeAsync: buy,
    isSuccess,
  } = useContractWrite({
    abi,
    address: contractAddress,
    functionName: "buyShoe",
    args: [shoe.id],
    overrides: {
      value: shoe.price,
    },
    mode: "recklesslyUnprepared",
  });

  const {
    isLoading: delistIsLoading,
    writeAsync: delist,
    isSuccess: isDelistSuccess,
  } = useContractWrite({
    abi,
    address: contractAddress,
    functionName: "delistShoe",
    args: [shoe.id],
    mode: "recklesslyUnprepared",
  });

  return (
    <div className={`column ${isAdmin ? "is-3" : "is-2"}`}>
      <div className="card has-background-black-ter has-text-white is-rounded">
        <div className="card-image is-rounded">
          <figure className="image is-1by1" style={{ objectFit: "cover" }}>
            <img src={shoe.image} alt={shoe.name} />
          </figure>
        </div>
        <div>
          <ul className="p-2">
            <li>Name: {shoe.name}</li>
            <li>Brand: {shoe.brand}</li>
            <li>Size: {shoe.size.toString()}</li>
            <li>
              Price:
              <span className="has-text-weight-bold">
                {" "}
                {formatEther(shoe.price.toString()).slice(0, 5)} ETH
              </span>
            </li>
          </ul>
          {shoe.owner === address ? (
            <button
              disabled={delistIsLoading}
              className={`button 
              ${
                isDelistSuccess ? "is-warning" : "is-info"
              } is-fullwidth has-text-weight-bold ${
                delistIsLoading ? "is-loading" : ""
              }`}
              onClick={() => {
                delist().then(refetch);
              }}>
              {isDelistSuccess ? "Delisted" : "Delist"}
            </button>
          ) : (
            <button
              disabled={isLoading || !isConnected}
              className={`button ${
                isSuccess ? "is-warning" : "is-primary"
              }              is-fullwidth has-text-weight-bold ${
                isLoading ? "is-loading" : ""
              }`}
              onClick={() => {
                buy().then(() => {
                  refetch();
                  setTimeout(() => {
                    refetchTxs?.();
                  }, 1000);
                });
              }}>
              {isSuccess ? "Bought" : "Buy"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ListedShoe);
