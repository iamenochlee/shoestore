import { useReducer, useState } from "react";
import Input from "./Input";
import ImageInput from "./ImageInput";
import type { Args, Preview, ShoeDetails, AddShoeProps } from "../types";
import { abi, contractAddress } from "../constants";
import { pinImage } from "../helpers/pinImage";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { parseEther } from "ethers/lib/utils.js";

const defaultDetails = {
  name: "",
  brand: "",
  size: 0,
  price: 0,
  image: undefined,
};

const AddShoe = ({ setIndex }: AddShoeProps) => {
  const [args, setArgs] = useState<Args>(undefined);
  const [loading, setLoading] = useState(false);
  const [toShow, setToShow] = useState(false);
  const [preview, setPreview] = useState<Preview>(null);
  const [prepared, setPrepared] = useState(false);
  const [shoeDetails, updateShoeDetails] = useReducer(
    (current: ShoeDetails, update: Partial<ShoeDetails>) => {
      return { ...current, ...update };
    },
    defaultDetails
  );

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "createShoe",
    args,
  });

  const { writeAsync, isLoading } = useContractWrite(config);

  async function handleArgs() {
    if (!shoeDetails.image) return;
    setLoading(true);
    const imgUrl = await pinImage(
      shoeDetails.image,
      shoeDetails.name,
      setLoading
    );
    const shoeDetailsArgs = [...Object.values(shoeDetails)];
    shoeDetailsArgs[3] = parseEther(shoeDetailsArgs[3]?.toString() as string);
    shoeDetailsArgs.pop();
    setArgs([...shoeDetailsArgs, imgUrl]);
    setPrepared(true);
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
              writeAsync?.().then(() => {
                setToShow(true);
                updateShoeDetails(defaultDetails);
                setPreview(null);
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
    </>
  );
};

export default AddShoe;
