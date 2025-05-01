import React from "react";
import { PuffLoader } from "react-spinners";

const Loader = () => (
  <div className="loader-Wrapper">
    <PuffLoader
      color=" #3f37c9"
      cssOverride={{
        width: "100px",
      }}
    />
  </div>
);
export default Loader;
