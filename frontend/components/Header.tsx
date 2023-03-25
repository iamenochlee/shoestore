import React from "react";
import { ConnectKitButton } from "connectkit";

const Header = () => {
  return (
    <header className="px-5 py-3 is-flex is-align-items-center is-justify-content-space-between height-50 has-background-info">
      <h1 className="has-text-weight-bold is-size-3">MEGA SHOES</h1>
      <div>
        <ConnectKitButton showBalance={true} />
      </div>
    </header>
  );
};

export default Header;
