import React from "react";
import { ModalProps } from "../types";
import { parseEther } from "ethers/lib/utils.js";
import { useContractWrite } from "wagmi";
import { abi, contractAddress } from "../constants";

const ChangePriceModal = ({
  isActive,
  toggleModal,
  newPrice,
  shoe,
  setNewPrice,
  refetch,
}: ModalProps) => {
  const {
    isSuccess,
    isLoading,
    writeAsync: change,
  } = useContractWrite({
    abi,
    address: contractAddress,
    functionName: "changeShoePrice",
    args: [shoe.id, parseEther(newPrice.toString())],
    mode: "recklesslyUnprepared",
  });

  return (
    <div className={`modal ${isActive ? "is-active" : ""}`}>
      <div className="modal-background" onClick={toggleModal}></div>
      <div className="modal-content">
        <header className="modal-card-head has-background-black-ter ">
          <p className="modal-card-title is-size-5 has-text-white">
            Change Shoe{" "}
            <span className="has-text-weight-bold">
              ID: {parseInt(shoe.id._hex)}
            </span>{" "}
            Price?
          </p>
          <button
            className="delete"
            aria-label="close"
            onClick={toggleModal}></button>
        </header>
        <section className="modal-card-body has-background-black-ter">
          <div className="is-flex gap-1 pt-3 mb-6">
            <p>To: </p>
            <input
              className="input is-small"
              type="number"
              value={newPrice}
              onChange={(e) => {
                setNewPrice(e.target.value);
                console.log(newPrice);
              }}
            />
            <p className="has-text-weight-bold">ETH</p>
          </div>
          <button
            className={`button ${
              !isSuccess ? "is-info" : "is-success"
            } ml-auto is-flex ${isLoading ? "is-loading" : ""}`}
            onClick={() => {
              isSuccess ? toggleModal() : change().then(refetch);
            }}
            disabled={isLoading}>
            {!isSuccess ? " CHANGE" : "DONE"}
          </button>
        </section>
      </div>
    </div>
  );
};

export default ChangePriceModal;
