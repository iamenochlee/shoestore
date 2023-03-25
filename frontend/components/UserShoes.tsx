import React, { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { abi, contractAddress } from "../constants";
import UserShoe from "./UserShoe";
import type { Shoe } from "../types";
import { useStore } from "zustand";
import { refchListedStore } from "../store";

const UserShoes = ({ index }: { index: number }) => {
  const { address } = useAccount();
  const [userShoes, setUserShoes] = useState<readonly Shoe[]>([]);
  const { setFetch } = useStore(refchListedStore);

  const contractRead = useContractRead({
    abi,
    address: contractAddress,
    functionName: "getAllUserShoes",
    args: [address],
    onSuccess: () => {
      setUserShoes(contractRead.data as Shoe[]);
      setFetch(contractRead.refetch);
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
      {userShoes && userShoes.length ? (
        [...userShoes].map((shoe) => {
          return (
            <UserShoe
              key={shoe.id._hex}
              shoe={shoe}
              refetch={contractRead.refetch}
            />
          );
        })
      ) : (
        <p className="mt-6 px-6 ">
          {contractRead.isFetching
            ? "Fetching Your Shoes..."
            : "Oops!, You have no shoes."}
        </p>
      )}
    </div>
  );
};

export default UserShoes;
