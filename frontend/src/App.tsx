import "./App.css";
import "bulma/css/bulma.min.css";
import { ConnectKitButton } from "connectkit";
import { useAccount, useContractRead } from "wagmi";
import ListedShoes from "../components/ListedShoes";
import AddShoe from "../components/AddShoe";
import Navbar from "../components/Navbar";
import UserShoes from "../components/UserShoes";
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
  });

  return (
    <>
      <div className="App p-3 px-6">
        <header className="mb-6 is-flex is-align-items-center height-50">
          <h1 className="mr-6 has-text-weight-bold">MEGA SHOES</h1>
          <div className="ml-6">
            <ConnectKitButton showBalance={true} />
          </div>
        </header>
        <div className="columns is-flex mb-6">
          <div className={`column ${isAdmin ? "is-two-thirds" : ""}`}>
            <div className="columns is-flex is-flex-direction-column">
              <Navbar
                setIndex={setIndex}
                isConnected={isConnected}
                index={index}
              />
              {index === 0 && <ListedShoes />}
              {index === 1 && <UserShoes />}
            </div>
          </div>
          {isConnected && isAdmin && (
            <div className="column is-one-thirds">
              <AddShoe setIndex={setIndex} />
            </div>
          )}
        </div>
      </div>
      <footer className="is-flex has-background-black has-text-white is-align-items-center is-justify-content-space-between py-4 px-6">
        <h1 className="is-bold mr-6 has-text-weight-bold">MEGA SHOES</h1>
        <h2>copyright &#169;2023 </h2>
      </footer>
    </>
  );
}

export default App;
