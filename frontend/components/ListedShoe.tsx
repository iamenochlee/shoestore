import React, { useState, useEffect } from "react";
import { formatEther } from "ethers/lib/utils.js";
import type { ListedShoeProps } from "../types";
import { useAccount, useContractWrite } from "wagmi";
import { abi, tokenAbi, contractAddress, tokenAddress } from "../constants";
import { useStore } from "zustand";
import {
  UserBalanceStore,
  isAdminStore,
  refchTransactionsStore,
} from "../store";
import { BigNumber } from "ethers";

const ListedShoe = ({ shoe, refetch }: ListedShoeProps) => {
  const { isConnected, address } = useAccount();
  const [error, showError] = useState(false);
  const { refetch: refetchTxs } = useStore(refchTransactionsStore);
  const { isAdmin } = useStore(isAdminStore);
  const { balance } = useStore(UserBalanceStore);

  const { isLoading: approveTokensIsLoading, writeAsync: approveTokens } =
    useContractWrite({
      abi: tokenAbi,
      address: tokenAddress,
      functionName: "approve",
      args: [contractAddress, shoe.price],
      mode: "recklesslyUnprepared",
    });

  const {
    isLoading,
    writeAsync: buy,
    isSuccess,
  } = useContractWrite({
    abi,
    address: contractAddress,
    functionName: "buyShoe",
    args: [shoe.id],
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

  useEffect(() => {
    showError(false);
  }, [isConnected]);

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
                {formatEther(shoe.price).slice(0, 5)} MEGA
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
              disabled={isLoading || approveTokensIsLoading || !isConnected}
              className={`button ${
                isSuccess ? "is-warning" : "is-primary"
              }              is-fullwidth has-text-weight-bold ${
                isLoading || approveTokensIsLoading ? "is-loading" : ""
              }`}
              onClick={() => {
                showError(false);
                if (balance && balance.sub(shoe.price) < BigNumber.from(0)) {
                  showError(true);
                  return;
                }
                approveTokens()
                  .then(() => buy())
                  .then(() => {
                    refetch();
                    setTimeout(() => {
                      refetchTxs?.();
                    }, 1000);
                  });
              }}>
              {isSuccess ? "Bought" : "Buy"}
            </button>
          )}
          {error && <div className="error p-1 ">Insufficient MEGA Tokens</div>}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ListedShoe);
