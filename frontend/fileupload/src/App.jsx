import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [file, setFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fetchUploads = async () => {
    try {
      const res = await axios.get("http://localhost:3001/files");
      setUploads(res.data);
    } catch (err) {
      console.error("Error fetching files:", err.message);
    }
  };

  const deleteFile = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/files/${id}`);
      fetchUploads();
    } catch (err) {
      console.error("Error deleting file:", err.message);
    }
  }
  const downloadFile = async (id, name) => {
  try {
    const { data } = await axios.get(`http://localhost:3001/files/${id}`, {
      responseType: "blob",
    });

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url); 
  } catch (err) {
    console.error("Download failed:", err);
  }
};

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await axios.post("http://localhost:3001/upload", formData);
      setFile(null);
      fetchUploads();
    } catch (err) {
      alert("Upload failed.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Uploaded file</h2>

      <div className="mb-3 d-flex align-items-center justify-content-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="form-control me-2"
        />
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <h4 className="mt-5">Uploaded Files</h4>
      <ul className="list-group mt-3">
        {uploads.map((item) => (
          <li
            key={item._id}
            className="list-group-item d-flex justify-content-between"
          >
            <span>{item.name}</span>
            <span className="badge bg-secondary">{item.mimetype}</span>
            <button className="btn btn-primary" onClick={() => downloadFile(item._id, item.name)}>
              Download
            </button>
            <button className="btn btn-danger" onClick={() => deleteFile(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
