import React, { useState } from "react";
import "./App.css";
import axios from "axios";

export default function Uploader() {
  const [file, setFile] = useState(null);

  const onImageChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);

    axios
      .post("http://localhost:3000/upload_files", data)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.errors) {
          alert(data.errors);
        } else {
          console.log(data);
        }
      });

    setFile(null);
  };

  return (
    <>
      <form className="form" method="post">
        <div className="btn-container">
          <input
            type="file"
            id="files"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
          <label className="button" htmlFor="files">
            Select Image
          </label>
        </div>
        <div className="img-container">
          <label>{file ? file.name : "Image Name"}</label>
        </div>
      </form>
      <div className="results">
        <button className="button" type="submit" onClick={onSubmitHandler}>
          Upload
        </button>
        <button className="button" style={{ margin: "auto" }}>
          Get Results
        </button>
      </div>
    </>
  );
}

// {imageURLs.map((imageSRC) => (
//   <img className="img-size" alt={imageSRC} src={imageSRC} />
// ))}
