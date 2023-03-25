import React from "react";
import type { UserHistory } from "../types";
import { formatEther } from "ethers/lib/utils.js";

const Transaction = ({ history }: { history: UserHistory }) => {
  return (
    <div>
      <div>id: {parseInt(history.id._hex)}</div>
      <div>{history.name}</div>
      <div>{history.brand}</div>
      <div>{formatEther(history.price)}</div>
      <div>{history.txType}</div>
    </div>
  );
};

export default Transaction;
