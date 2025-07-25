
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import  connectToMongo  from "./db.js";
import Upload from "./upload.model.js";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());

const MONGOURI = "mongodb://localhost:27017/metadata";


connectToMongo();



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // prevent overwrite
  },
});

const upload = multer({ storage });


app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const newFile = new Upload({
      name: req.file.originalname,
      mimetype: req.file.mimetype,
      path: req.file.path,
    });

    await newFile.save();

    res.status(201).json({ message: "File uploaded successfully!", file: newFile });
  } catch (err) {
    console.log("Upload Error:", err);
    res.status(500).json({ message: "Something went wrong!" });
  }
});


app.get("/files", async (req, res) => {
  const files = await Upload.find({});
  res.json(files);
});


app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
