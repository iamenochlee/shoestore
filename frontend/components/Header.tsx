import React from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useContractRead } from "wagmi";
import { tokenAbi, tokenAddress } from "../constants";
import { useStore } from "zustand";
import { UserBalanceStore } from "../store";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";

const Header = () => {
  const { address, isConnected } = useAccount();
  const { balance, setUserBalance } = useStore(UserBalanceStore);

  const contractRead = useContractRead({
    abi: tokenAbi,
    address: tokenAddress,
    functionName: "balanceOf",
    args: [address],
    onSuccess: () => {
      setUserBalance(contractRead.data as BigNumber);
    },
    watch: true,
  });
  return (
    <header className="px-4 py-3 has-background-info-dark is-flex is-align-items-center is-justify-content-space-between height-50">
      <div className="px-4 is-flex is-align-items-center">
        <h1 className="has-text-weight-bold is-size-3 pr-2 is-centered has-text-white">
          MEGA SHOES
        </h1>
        <img
          src="/shoe.png"
          alt="shoe"
          width="50px"
          height="50px"
          loading="lazy"
        />
      </div>
      <div className="is-flex px-4 is-align-items-center gap-1 has-text-weight-bold">
        {isConnected && contractRead.isFetched && (
          <div className="has-text-white is-flex px-4 py-1 is-align-items-center gap-2 is-size-5 has-background-black-ter is-rounded">
            <p className="has-text-primary">
              {balance && formatEther(balance.toString()).slice(0, 5)}
            </p>
            MEGA
          </div>
        )}
        <ConnectKitButton showBalance={true} />
      </div>
    </header>
  );
};

export default Header;
