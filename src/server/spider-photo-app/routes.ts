import express, { Router } from "express";
import controllers from "./controllers";
const photoRouter: Router = express.Router();
const multer = require("multer")
import Logger from "../helpers/logger";
import redisFunctions from "../databases/redis/functions";
import { IAccessConfig } from "../helpers/interfaces";

const studentsPhotoStorage = multer.diskStorage({
  destination: async (req, res, cb) => {
    const config = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;
    cb(null, config.studentsPhotoDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const uploadStudentPhoto = multer({ storage: studentsPhotoStorage })


const downloadDir = "C:/SPIDER/spd_save_tmp"

const downloadDirStorage = multer.diskStorage({
  destination: async (req, res, cb) => {
    const config = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;
    cb(null, downloadDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const uploadPhotosZipJson = multer({ storage: downloadDirStorage })


photoRouter.post('/bulkuploadstudentsphoto', controllers.bulkUploadStudentsPhoto)
photoRouter.post('/uploadphotoszipjson', uploadPhotosZipJson.single('zip_file'), controllers.uploadPhotosZipJson)

photoRouter.post('/bulkuploademployeesphoto', controllers.bulkUploadEmployeesPhoto)


photoRouter.post('/uploadStudentPhoto', uploadStudentPhoto.single('photo'), controllers.uploadStudentPhoto) 
photoRouter.get('/list', controllers.getAllPhoto)
photoRouter.get('/student/:studentId', controllers.getStudentPhotoInfosById) 
photoRouter.get('/progdata', controllers.getProgData)

export default photoRouter;


















// photoRouter.post('/uploadStudentPhoto', uploadStudentsPhoto.single('photo'), (req, res) => {
//   console.log('req', req)
  
//   const response = { status: 1, data: { path: (req as any).file.path } }
//   res.send(response)
// })
