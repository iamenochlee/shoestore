import React from "react";
import type { NavbarProps } from "../types";

const Navbar = ({ setIndex, index }: NavbarProps) => {
  return (
    <nav>
      <ul className="is-flex gap-1 mt-2 mb-4">
        <li
          className={`${index === 0 ? "is-underlined" : ""} is-size-6 link `}
          style={{ cursor: "pointer" }}
          onClick={() => setIndex(0)}>
          Home
        </li>
        <li
          style={{ cursor: "pointer" }}
          onClick={() => setIndex(1)}
          className={`${index === 1 ? "is-underlined" : ""} is-size-6 link`}>
          MyShoes
        </li>
        <li className="is-size-6">
          <a style={{ color: "white" }} href="#transactions">
            Activities
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
