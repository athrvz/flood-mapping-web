import React, { useState} from "react";
import "./App.css";
import LoadingSpinner from "./spinner";
import axios from "axios";

export default function Uploader() {
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);

  const onImageChange = (e) => {
    setFileList(Array.prototype.slice.call(e.target.files));
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (fileList.length === 0) return;

    const data = new FormData();
    Object.keys(fileList).forEach((file, i) => {
      data.append(`image${i + 1}`, fileList[i], fileList[i].name);
    });

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
  };

  const getResult = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios.get('http://localhost:5000/results', {
      responseType: 'arraybuffer'
    })
    .then(response => {
      const blob = new Blob([response.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
      setIsLoading(false);
    })
    .catch(error => {
      console.log(error);
    });
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
        <div className="container">
          <div className="img-container">
            <label>
              {fileList &&
                fileList.map((file, index) => {
                  return <p>image-{index + 1 + " : " + file.name}</p>;
                })}
            </label>
          </div>
          <div className="img-container">
            {/* {isLoading && image ? <LoadingSpinner /> : <ImageContainer data={image} />} */}
            {image ? <img className="result-image" src={image} alt="png" /> :<LoadingSpinner /> }
          </div>
        </div>
      </form>
      <div className="results">
        <button className="button" type="submit" onClick={onSubmitHandler}>
          Upload
        </button>
        <button className="button" onClick={getResult} disabled={isLoading}>
          Get Results
        </button>
      </div>
    </>
  );
}
