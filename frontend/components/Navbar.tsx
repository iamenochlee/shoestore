import type { NavbarProps } from "../types";

const Navbar = ({ setIndex, isConnected, index }: NavbarProps) => {
  return (
    <nav>
      {isConnected && (
        <ul className="is-flex px-6 gap-5 mb-3">
          <li
            className={`pr-6 ${index === 0 ? "is-underlined" : ""}`}
            style={{ color: "green" }}
            onClick={() => setIndex(0)}>
            Home
          </li>
          <li
            style={{ color: "green" }}
            onClick={() => setIndex(1)}
            className={index === 1 ? "is-underlined" : ""}>
            MyShoes
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
