import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
    console.log(file);
  },
  filename: (req, file, cb) => {
    // Extract the original filename without the extension
    const originalName = path.parse(file.originalname).name;
    // Construct the new filename with the original name, current timestamp, and original extension
    const newFilename = `${originalName}-${Date.now()}${path.extname(
      file.originalname
    )}`;

    cb(null, newFilename); // Store the file with the new name
  },
});

const upload = multer({ storage: storage });

export default upload;
