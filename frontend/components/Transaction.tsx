import React from "react";
import type { UserHistory } from "../types";
import { formatEther } from "ethers/lib/utils.js";
import { formatRelativeTime } from "../utils";

const Transaction = ({ history }: { history: UserHistory }) => {
  return (
    <tr>
      <th className="has-text-white">#{parseInt(history.id._hex)}</th>
      <td>{history.name}</td>
      <td>{history.brand}</td>
      <td>
        {formatEther(history.price).slice(0, 5)}{" "}
        <small className="has-text-weight-bold">MEGA</small>
      </td>
      <td>
        <p
          className={`${
            history.txType === "bought"
              ? "is-bought"
              : history.txType === "create"
              ? "is-create"
              : "is-sold"
          } highlight`}>
          {history.txType}
        </p>
      </td>
      <td>{formatRelativeTime(parseInt(history.time._hex))}</td>
    </tr>
  );
};

export default Transaction;
