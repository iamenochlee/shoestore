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

function App() {
  const { address, isConnected } = useAccount();
  const [index, setIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const contractRead = useContractRead({
    abi,
    address: contractAddress,
    functionName: "admins",
    args: [address],
    onSuccess: () => {
      console.log(contractRead.data);
      setIsAdmin(contractRead.data as boolean);
    },
    watch: true,
  });

  useEffect(() => {
    contractRead.refetch();
  }, [isConnected]);

  return (
    <>
      <Header />
      <div className="App p-3 px-6">
        <div className="columns is-flex">
          <div className={`column ${isAdmin ? "is-two-thirds" : ""}`}>
            <div className="columns is-flex is-flex-direction-column main">
              <Navbar
                setIndex={setIndex}
                isConnected={isConnected}
                index={index}
              />
              {index === 0 && <ListedShoes index={index} />}
              {index === 1 && <UserShoes index={index} />}
            </div>
          </div>
          {isConnected && isAdmin && (
            <div className="column is-one-thirds">
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
