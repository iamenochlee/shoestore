import { useAccount, useContractRead } from "wagmi";
import { abi, contractAddress } from "../constants";
import { useState } from "react";
import UserShoe from "./UserShoe";
import { Shoe } from "../types";

const UserShoes = () => {
  const { address } = useAccount();
  const [userShoes, setUserShoes] = useState<readonly Shoe[]>([]);

  const contractRead = useContractRead({
    abi,
    address: contractAddress,
    functionName: "getAllUserShoes",
    args: [address],
    onSuccess: () => {
      console.log(contractRead.data);
      setUserShoes(contractRead.data as Shoe[]);
    },
  });
  return (
    <div className="columns is-multiline">
      {userShoes && userShoes.length ? (
        [...userShoes].map((shoe) => {
          return <UserShoe key={shoe.id._hex} shoe={shoe} />;
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
