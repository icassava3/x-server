import express, { Router } from "express";
import controllers from "./controllers";


const fichierERSYSRouter: Router = express.Router();

fichierERSYSRouter.post("/fichierersys", controllers.genererFichierERSYS);

export default fichierERSYSRouter;
