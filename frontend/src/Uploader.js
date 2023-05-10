import React, { useState } from "react";
import "./App.css";
import axios from "axios";

export default function Uploader() {
  const [fileList, setFileList] = useState([]);

  const onImageChange = (e) => {
    // setFileList(e.target.files);
    setFileList(Array.prototype.slice.call(e.target.files));
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (fileList.length === 0) return;

    const data = new FormData();
    Object.keys(fileList).forEach((file, i) => {
      data.append(`image-${i + 1}`, fileList[i], fileList[i].name);
    });

    axios
      .post("http://localhost:5000/upload", data)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.errors) {
          alert(data.errors);
        } else {
          console.log(data);
        }
      });

    setFileList(null);
  };

  const getResult = (e) => {
    e.preventDefault();

    // axios
    //   .get("http://localhost:5000/results").then(response => {
    //     console.log(response.data);
    //     console.log(response.data == null)
    //     console.log(base64.encode(response.data))
    // }).catch(err => console.log(err));

    axios
      .get("http://localhost:5000/results", {
        responseType: "arraybuffer",
      })
      .then((response) =>
        Buffer.from(response.data, "binary").toString("base64")
      );
  };

  return (
    <>
      <form className="form" method="post">
        <div className="btn-container">
          <input
            type="file"
            id="files"
            multiple
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
          <label className="button" htmlFor="files">
            Select Image
          </label>
        </div>
        <div className="img-container">
          <label>
            {fileList &&
              fileList.map((file, index) => {
                return <p>image-{index + 1 + " : " + file.name}</p>;
              })}
          </label>
        </div>
      </form>
      <div className="results">
        <button className="button" type="submit" onClick={onSubmitHandler}>
          Upload
        </button>
        <button className="button" onClick={getResult}>
          Get Results
        </button>
      </div>
    </>
  );
}

// {imageURLs.map((imageSRC) => (
//   <img className="img-size" alt={imageSRC} src={imageSRC} />
// ))}
