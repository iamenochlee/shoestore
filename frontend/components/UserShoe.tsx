import { Shoe } from "../types";
import { formatEther } from "ethers/lib/utils.js";
import { useContractWrite } from "wagmi";
import { abi, contractAddress } from "../constants";

const UserShoe = ({ shoe }: { shoe: Shoe }) => {
  const {
    isSuccess,
    isLoading,
    write: list,
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
    write: unlist,
  } = useContractWrite({
    abi,
    address: contractAddress,
    functionName: "delistShoe",
    args: [shoe.id],
    mode: "recklesslyUnprepared",
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
                {formatEther(shoe.price.toString()).slice(0, 5)} ETH
              </span>
            </li>
          </ul>
          {shoe.isListed ? (
            <button
              disabled={unlistIsLoading}
              className={`button ${
                isUnlistSuccess ? "is-warning" : "is-info"
              } is-fullwidth has-text-weight-bold ${
                unlistIsLoading ? "is-loading" : ""
              }`}
              onClick={() => unlist()}>
              {isUnlistSuccess ? "Unlisted" : "UnList"}
            </button>
          ) : (
            <button
              disabled={isLoading}
              className={`button ${
                isSuccess ? "is-warning" : "is-primary"
              } is-fullwidth has-text-weight-bold ${
                isLoading ? "is-loading" : ""
              }`}
              onClick={() => list()}>
              {isSuccess ? "Listed" : "List"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserShoe;
