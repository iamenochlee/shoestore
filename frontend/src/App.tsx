import "./App.css";
import "bulma/css/bulma.min.css";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import ListedShoes from "../components/ListedShoes";
import AddShoe from "../components/AddShoe";
import Navbar from "../components/Navbar";
import UserShoes from "../components/UserShoes";
import { useState } from "react";

function App() {
  const { isConnected } = useAccount();
  const [index, setIndex] = useState(0);

  return (
    <div className="App p-3 px-6">
      <div className="mb-6 height-50">
        <ConnectKitButton showBalance={true} />
      </div>
      <div className="columns is-flex">
        <div className="column is-two-thirds">
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
        <div className="column is-one-thirds ">
          {isConnected ? (
            <AddShoe setIndex={setIndex} />
          ) : (
            <div className="mt-6 is-flex is-flex-direction-column is-centered">
              <h2 className="mb-5">Connect Your Wallet To Proceed</h2>
              <ConnectKitButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
