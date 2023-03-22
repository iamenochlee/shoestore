import React from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import type { Shoe } from "../types";
import { abi, contractAddress } from "../constants";
import { formatEther } from "ethers/lib/utils.js";

const ListedShoe = ({ shoe }: { shoe: Shoe }) => {
  const { isConnected } = useAccount();

  const { address } = useAccount();
  const { config } = usePrepareContractWrite({
    abi,
    address: contractAddress,
    functionName: "buyShoe",
    args: [shoe.id],
    overrides: {
      value: shoe.price,
    },
  });

  const { isLoading, write: buy, isSuccess } = useContractWrite(config);

  const { config: delistConfig } = usePrepareContractWrite({
    abi,
    address: contractAddress,
    functionName: "delistShoe",
    args: [shoe.id],
  });

  const {
    isLoading: delistIsLoading,
    write: unlist,
    isSuccess: isDelistSuccess,
  } = useContractWrite(delistConfig);

  return (
    <div className="column is-3">
      <div className="card is-rounded">
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
              onClick={unlist}>
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
              onClick={buy}>
              {isSuccess ? "Bought" : "Buy"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ListedShoe);
