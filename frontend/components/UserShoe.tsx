import { Shoe } from "../types";
import { formatEther } from "ethers/lib/utils.js";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { abi, contractAddress } from "../constants";

const UserShoe = ({ shoe }: { shoe: Shoe }) => {
  const { config } = usePrepareContractWrite({
    abi,
    address: contractAddress,
    functionName: "listShoe",
    args: [shoe.id],
  });

  const { isLoading, data, write: list } = useContractWrite(config);
  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { config: configUnlist } = usePrepareContractWrite({
    abi,
    address: contractAddress,
    functionName: "delistShoe",
    args: [shoe.id],
  });

  const {
    isLoading: unlistIsLoading,
    data: unlistData,
    write: unlist,
  } = useContractWrite(configUnlist);

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
                {formatEther(shoe.price.toString())} ETH
              </span>
            </li>
          </ul>
          {shoe.isListed ? (
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
              disabled={isLoading}
              className={`button is-primary is-fullwidth has-text-weight-bold ${
                isLoading ? "is-loading" : ""
              }`}
              onClick={list}>
              {isSuccess ? "Listed" : "List"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserShoe;
