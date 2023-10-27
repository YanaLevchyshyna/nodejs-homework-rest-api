import multer from 'multer';
import path from 'path';

const destination = path.resolve('temp');

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 5 * 1024 * 1024, // розмір 5 Mb
};

// const fileFilter = (req, file, cb) => {
//   if (file.originalname.split('.').pop() === 'exe') {
//     cb(new Error("File extention doesn't allow"));
//   }
//   cb(null, true);
// };

const upload = multer({
  storage: storage,
  limits: limits,
  // fileFilter: fileFilter
});

export default upload;
