import React from "react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
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

  const { isLoading, data, write: buy } = useContractWrite(config);
  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { config: unlistConfig } = usePrepareContractWrite({
    abi,
    address: contractAddress,
    functionName: "delistShoe",
    args: [shoe.id],
  });

  const {
    isLoading: unlistIsLoading,
    data: unlistData,
    write: unlist,
  } = useContractWrite(unlistConfig);

  const { isSuccess: isUnlistSuccess } = useWaitForTransaction({
    hash: unlistData?.hash,
  });

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
                {formatEther(shoe.price.toString()).slice(0, 4)} ETH
              </span>
            </li>
          </ul>
          {shoe.owner === address ? (
            <button
              disabled={unlistIsLoading}
              className={`button is-info is-fullwidth has-text-weight-bold ${
                unlistIsLoading ? "is-loading" : ""
              }`}
              onClick={unlist}>
              {isUnlistSuccess ? "Unlisted" : "UnList"}
            </button>
          ) : (
            <button
              disabled={isLoading || !isConnected}
              className={`button is-primary is-fullwidth has-text-weight-bold ${
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
