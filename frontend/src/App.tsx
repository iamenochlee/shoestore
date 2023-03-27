import "./App.css";
import "bulma/css/bulma.min.css";
import React, { useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import ListedShoes from "../components/ListedShoes";
import CreateShoe from "../components/CreateShoe";
import UserTransactions from "../components/UserTransactions";
import Navbar from "../components/Navbar";
import UserShoes from "../components/UserShoes";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { abi, contractAddress } from "../constants";
import { useStore } from "zustand";
import { isAdminStore } from "../store";

function App() {
  const { address, isConnected } = useAccount();
  const [index, setIndex] = useState(0);
  const { isAdmin, setUserIsAdmin } = useStore(isAdminStore);

  const contractRead = useContractRead({
    abi,
    address: contractAddress,
    functionName: "admins",
    args: [address],
    onSuccess: () => {
      setUserIsAdmin(contractRead.data as boolean);
    },
    watch: true,
  });

  useEffect(() => {
    contractRead.refetch();
  }, [isConnected]);

  return (
    <>
      <Header />
      <div className="App p-3 pb-6 px-6 has-text-white">
        <div className="columns pb-6 is-flex">
          <div className={`column ${isAdmin ? "is-two-thirds" : ""} pb-5`}>
            <div className="columns mt-2 is-flex is-flex-direction-column main">
              {isConnected ? (
                <Navbar setIndex={setIndex} index={index} />
              ) : (
                <p className="is-size-5 mb-5 has-text-weight-bold has-text-info is-centered">
                  Please Connect Your Wallet To Continue
                </p>
              )}
              {index === 0 && <ListedShoes index={index} />}
              {index === 1 && <UserShoes index={index} />}
            </div>
          </div>
          {isConnected && isAdmin && (
            <div className="column is-one-thirds mt-6 pb-6 has-dark-bg">
              <CreateShoe setIndex={setIndex} />
            </div>
          )}
        </div>
        {isConnected && <UserTransactions />}
      </div>
      <Footer />
    </>
  );
}

export default App;
