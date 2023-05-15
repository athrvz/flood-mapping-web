import React from "react";
import "./App.css";
import img from "../src/asset/icon.jpeg";

const ImageContainer = (data) => {
  return (
    <>
      {data.data ? (
        <img
          className="result-image"
          src={`data:image/png;base64,${data.data}`}
          alt="secret"
        />
      ) : (
        <img className="result-image" src={img} alt="secret" />
      )}
    </>
  );
};

export default ImageContainer;
