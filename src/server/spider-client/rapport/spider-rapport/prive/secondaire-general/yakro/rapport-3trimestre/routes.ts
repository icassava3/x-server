import express, { Router } from "express";
import controllers from "./controllers";
const priveYakroTrim3Router: Router = express.Router();


//route permettant de générer le rapport
priveYakroTrim3Router.get('/prive/secondairegeneral/yakro/3trimestre/:id', controllers.rapport); 

export default priveYakroTrim3Router;

