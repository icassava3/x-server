import express, { Router } from "express";
import controllers from "./controllers";
const photoShareRouter: Router = express.Router();


//route permettant d'envoyer les photos des élèves sur le server spider photo share
photoShareRouter.get('/sendstudentsphotos', controllers.sendStudentsPhotos) 

export default photoShareRouter;


















// photoShareRouter.post('/uploadStudentPhoto', uploadStudentsPhoto.single('photo'), (req, res) => {
//   console.log('req', req)
  
//   const response = { status: 1, data: { path: (req as any).file.path } }
//   res.send(response)
// })
