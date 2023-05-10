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

    // files.forEach((file, i) => {
    //   data.append(`files-${i}`, file, file.name);
    // });
    // data.append("file", files);
    // console.log(...data);

    axios({
      method: "post",
      url: "http://localhost:5000/upload",
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.errors) {
          alert(data.errors);
        } else {
          console.log(data);
        }
      });

    // axios
    //   .post("http://localhost:5000/upload", data)

    setFileList(null);
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
          <label>{fileList ? fileList.name : "Image Name"}</label>
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
