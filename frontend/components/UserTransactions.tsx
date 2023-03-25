import React from "react";
import { useContractRead, useAccount } from "wagmi";
import { abi, contractAddress } from "../constants";
import { useState } from "react";
import Transaction from "./Transaction";
import type { UserHistory } from "../types";

const UserTransactions = () => {
  const [history, setHistory] = useState<readonly UserHistory[]>([]);
  const { address } = useAccount();

  const contractRead = useContractRead({
    abi,
    address: contractAddress,
    functionName: "getUserHistory",
    args: [address],
    onSuccess: () => {
      setHistory(contractRead.data as UserHistory[]);
    },
  });
  return (
    <div className="columns is-multiline">
      {history && history.length ? (
        [...history].map((tx) => {
          return <Transaction key={tx.id._hex} history={tx} />;
        })
      ) : (
        <p className="mt-6 px-6 ">
          {contractRead.isFetching
            ? "Fetching Your Transactions..."
            : "You have no recent Transaction."}
        </p>
      )}
    </div>
  );
};

export default UserTransactions;
