import { useState } from "react";
import { Shoe } from "../types";
import ListedShoe from "./ListedShoe";
import { useContractRead } from "wagmi";
import { abi, contractAddress } from "../constants";

const ListedShoes = () => {
  const [listedShoes, setListedShoes] = useState<readonly Shoe[]>([]);
  const contractRead = useContractRead({
    abi,
    address: contractAddress,
    functionName: "getAllListedShoes",
    onSuccess: () => {
      console.log(contractRead.data);
      setListedShoes(contractRead.data as Shoe[]);
    },
  });
  return (
    <div className="columns is-multiline">
      {listedShoes && listedShoes.length ? (
        [...listedShoes].reverse().map((shoe) => {
          return <ListedShoe key={shoe.id._hex} shoe={shoe} />;
        })
      ) : (
        <h2 className="mt-6 px-6 ">
          {contractRead.isFetching
            ? "Fetching Listed Shoes..."
            : "No Shoes are Currently For Sale"}
        </h2>
      )}
    </div>
  );
};

export default ListedShoes;
