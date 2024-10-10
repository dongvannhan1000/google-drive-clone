import express from 'express';
import multer from 'multer';
import path from 'path';
import { isAuth } from '../middleware/authMiddleware';
import * as fileController from '../controllers/fileController';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/upload', isAuth, (req, res) => {
  res.render('upload');
});

router.post('/upload', isAuth, upload.single('file'), fileController.uploadFile);

export default router;