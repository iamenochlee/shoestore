import React from "react";

const Footer = () => {
  return (
    <footer className="is-flex has-text-white is-align-items-center is-justify-content-space-between py-4 px-6">
      <div>
        <h1 className="has-text-weight-bold is-size-4">MEGA SHOES</h1>
        <h2 className="is-size-6">copyright &#169;2023 </h2>
      </div>
      <ul className="is-flex gap-1">
        <a href="">
          <img src="/github.png" alt="github" width="40px" height="40px" />
        </a>
        <a href="">
          <img src="/twitter.png" alt="twitter" width="40px" height="40px" />
        </a>
      </ul>
    </footer>
  );
};

export default Footer;
