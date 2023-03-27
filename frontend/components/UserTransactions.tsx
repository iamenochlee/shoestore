import React from "react";
import { useContractRead, useAccount } from "wagmi";
import { abi, contractAddress } from "../constants";
import { useState } from "react";
import Transaction from "./Transaction";
import type { UserHistory } from "../types";
import { useStore } from "zustand";
import { refchTransactionsStore } from "../store";

const UserTransactions = () => {
  const [history, setHistory] = useState<readonly UserHistory[]>([]);
  const { address } = useAccount();
  const { setFetch } = useStore(refchTransactionsStore);

  const contractRead = useContractRead({
    abi,
    address: contractAddress,
    functionName: "getUserHistory",
    args: [address],
    onSuccess: () => {
      setHistory(contractRead.data as UserHistory[]);
      setFetch(contractRead.refetch);
    },
    watch: true,
  });
  return (
    <div className="mb-5 mt-6" id="transactions">
      <h2 className="mb-3 is-size-6 has-text-weight-bold">
        Recent Activities:
      </h2>
      {history && history.length ? (
        <table className="table is-fullwidth has-background-grey-darker has-text-white">
          <thead>
            <tr>
              <th>
                <abbr title="Shoe Id" className="has-text-white">
                  Shoe ID
                </abbr>
              </th>
              <th>
                <abbr title="Name" className="has-text-white">
                  Name
                </abbr>
              </th>
              <th>
                <abbr title="Brand" className="has-text-white">
                  Brand
                </abbr>
              </th>
              <th>
                <abbr title="Price" className="has-text-white">
                  Price
                </abbr>
              </th>
              <th>
                <abbr title="Type" className="has-text-white">
                  Type
                </abbr>
              </th>
              <th>
                <abbr title="Time" className="has-text-white">
                  Time
                </abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...history].reverse().map((tx, i) => {
              return <Transaction history={tx} key={tx.id._hex + i} />;
            })}
          </tbody>
        </table>
      ) : (
        <p>
          {contractRead.isFetching
            ? "Fetching Your Transactions..."
            : "You have no recent Transaction."}
        </p>
      )}
    </div>
  );
};

export default UserTransactions;
