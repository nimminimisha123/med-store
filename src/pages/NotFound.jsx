import React from "react";
import NOT_FOUND from "../assets/not-found.gif";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container-fluid">
      <div className="row vh-100">
        <div className="col-12 d-flex flex-column align-items-center justify-content-center">
          <h1 className="text-404 fw-bolder">404</h1>
          <img src={NOT_FOUND} alt="not-gound-gif" className="not-found-gif" />
          <p className="test-dark text-center fw-semibold">
            Error NOT FOUND! The page you're requesting is either deleted or
            removed
          </p>
          <Link className="btn btn-primary" to="/">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
