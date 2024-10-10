import express from 'express';
import multer from 'multer';
import path from 'path';
import { isAuth } from '../middleware/authMiddleware';
import * as fileController from '../controllers/fileController';
import * as folderController from '../controllers/folderController';

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

// Folder routes
router.post('/folders', isAuth, folderController.createFolder);
router.get('/folders', isAuth, folderController.getFolders);
router.get('/folders/:id', isAuth, folderController.getFolder);
router.put('/folders/:id', isAuth, folderController.updateFolder);
router.delete('/folders/:id', isAuth, folderController.deleteFolder);

// File routes within folders
router.post('/folders/:folderId/upload', isAuth, upload.single('file'), fileController.uploadFileToFolder);

router.delete('/files/:id', isAuth, fileController.deleteFile);

export default router;