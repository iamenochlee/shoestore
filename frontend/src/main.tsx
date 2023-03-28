import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createClient, WagmiConfig } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { goerli, hardhat } from "wagmi/chains";

const client = createClient(
  getDefaultClient({
    appName: "shoeStore",
    chains: [goerli, hardhat],
  })
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="midnight">
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
