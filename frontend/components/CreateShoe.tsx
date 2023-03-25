import React from "react";
import { parseEther } from "ethers/lib/utils.js";
import { useReducer, useState } from "react";
import { useContractWrite } from "wagmi";
import { abi, contractAddress } from "../constants";
import { pinImage } from "../helpers/pinImage";
import type { AddShoeProps, Args, Preview, ShoeDetails } from "../types";
import ImageInput from "./ImageInput";
import Input from "./Input";
import { useStore } from "zustand";
import { refchListedStore } from "../store";

const defaultDetails = {
  name: "",
  brand: "",
  size: 0,
  price: 0,
  image: undefined,
};

const CreateShoe = ({ setIndex }: AddShoeProps) => {
  const [args, setArgs] = useState<Args>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [toShow, setToShow] = useState(false);
  const [preview, setPreview] = useState<Preview>(null);
  const [prepared, setPrepared] = useState(false);
  const { refetch } = useStore(refchListedStore);

  const [shoeDetails, updateShoeDetails] = useReducer(
    (current: ShoeDetails, update: Partial<ShoeDetails>) => {
      return { ...current, ...update };
    },
    defaultDetails
  );

  const { writeAsync: createShoe, isLoading } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "createShoe",
    args,
    mode: "recklesslyUnprepared",
  });

  async function handleArgs() {
    if (!shoeDetails.image) return;
    try {
      setLoading(true);
      const imgUrl = await pinImage(shoeDetails.image, shoeDetails.name);
      const { name, brand, size, price } = shoeDetails;
      const priceInWei = parseEther(price.toString());
      const args = [name, brand, size, priceInWei, imgUrl];
      setArgs(args);
      setPrepared(true);
    } catch (e) {
      console.error(e);
      setPrepared(false);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()} className="px-6 ">
        <h1 className="has-text-weight-bold">Welcome Admin</h1>
        <h3 className="mb-3 is-centered">Add Shoe</h3>
        <ImageInput
          handleChange={updateShoeDetails}
          value={shoeDetails.image?.name}
          name="image"
          preview={preview}
          setPreview={setPreview}
        />
        <Input
          type="text"
          placeholder="name"
          name="name"
          value={shoeDetails.name}
          handleChange={updateShoeDetails}
        />
        <Input
          type="text"
          placeholder="brand"
          name="brand"
          value={shoeDetails.brand}
          handleChange={updateShoeDetails}
        />
        <Input
          name="size"
          type="number"
          placeholder="size"
          value={shoeDetails.size}
          handleChange={updateShoeDetails}
          min={0}
          step="0.01"
        />
        <Input
          name="price"
          type="number"
          placeholder="price"
          value={parseFloat(shoeDetails.price.toString())}
          handleChange={updateShoeDetails}
          min={0}
          step="0.001"
        />
        <div className="buttons is-justify-content-right px-6 mt-5">
          <button
            className={`button is-info mr-5 ${loading ? "is-loading" : ""}`}
            onClick={handleArgs}
            disabled={
              prepared ||
              loading ||
              !shoeDetails.image ||
              !shoeDetails.name ||
              !shoeDetails.brand
            }>
            Prepare
          </button>
          <button
            className={`button is-primary ${isLoading ? "is-loading" : ""}`}
            onClick={() =>
              createShoe?.().then(() => {
                setToShow(true);
                updateShoeDetails(defaultDetails);
                setPreview(null);
                refetch?.();
              })
            }
            disabled={!prepared || isLoading}>
            ADD
          </button>
        </div>
      </form>
      {toShow && (
        <div className="px-6 is-flex mt-5 is-flex-direction-column ">
          <p className="is-centered" style={{ color: "green" }}>
            SuccessFully Added!
          </p>
          <button
            onClick={() => {
              setIndex(1);
              setToShow(false);
              setPrepared(false);
            }}
            className="button is-info mx-6">
            View Your Shoes
          </button>
        </div>
      )}
      {error && (
        <div className="is-centered mt-4" style={{ color: "red" }}>
          {error}
        </div>
      )}
    </>
  );
};

export default CreateShoe;
