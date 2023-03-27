import React from "react";
import { ConnectKitButton } from "connectkit";

const Header = () => {
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
      <div className="px-4">
        <ConnectKitButton showBalance={true} />
      </div>
    </header>
  );
};

export default Header;
