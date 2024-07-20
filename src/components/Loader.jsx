import React from "react";
import HashLoader from "react-spinners/HashLoader";

const Loader = () => {
  return (
    <div className="container">
      <div className="row loader">
        <div className="col  d-flex align-items-center justify-content-center">
          <HashLoader size={30} color="#333" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
