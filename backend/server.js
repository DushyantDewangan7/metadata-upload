import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());


const connectToMongo = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/case-study");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};
connectToMongo();


const uploadSchema = new mongoose.Schema(
  {
    name: String,
    mimetype: String,
    size: Number,
    data: Buffer,
  },
  { timestamps: true }
);

const Upload = mongoose.model("Upload", uploadSchema);


const storage = multer.memoryStorage();
const upload = multer({ storage });



app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newFile = new Upload({
      name: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer,
    });

    await newFile.save();

    res.status(201).json({
      message: "File uploaded to MongoDB",
      fileId: newFile._id,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});


app.get("/files", async (req, res) => {
  try {
    const files = await Upload.find({}, { data: 0 }).lean();
    res.status(200).json(files);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});


app.get("/files/:id", async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.set({
      "Content-Type": file.mimetype,
      "Content-Disposition": `attachment; filename="${file.name}"`,
    });

    res.send(file.data);
  } catch (err) {
    console.error("Download Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete("/files/:id", async (req, res) => {
  try {
    await Upload.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
