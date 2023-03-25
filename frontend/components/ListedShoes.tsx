import React, { useEffect, useState } from "react";
import { Shoe } from "../types";
import ListedShoe from "./ListedShoe";
import { useContractRead } from "wagmi";
import { abi, contractAddress } from "../constants";

const ListedShoes = ({ index }: { index: number }) => {
  const [listedShoes, setListedShoes] = useState<readonly Shoe[]>([]);

  const contractRead = useContractRead({
    abi,
    address: contractAddress,
    functionName: "getAllListedShoes",
    onSuccess: () => {
      setListedShoes(contractRead.data as Shoe[]);
    },
    watch: true,
  });

  useEffect(() => {
    setTimeout(() => {
      contractRead.refetch();
    }, 1000);
  }, [index]);

  return (
    <div className="columns is-multiline">
      {listedShoes && listedShoes.length ? (
        [...listedShoes].reverse().map((shoe) => {
          return (
            <ListedShoe
              key={shoe.id._hex}
              shoe={shoe}
              refetch={contractRead.refetch}
            />
          );
        })
      ) : (
        <h2 className="mt-6 px-5 ">
          {contractRead.isFetching
            ? "Fetching Listed Shoes..."
            : "No Shoes are Currently For Sale"}
        </h2>
      )}
    </div>
  );
};

export default ListedShoes;
