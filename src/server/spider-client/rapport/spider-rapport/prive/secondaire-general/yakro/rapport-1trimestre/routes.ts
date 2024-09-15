import express, { Router } from "express";
import controllers from "./controllers";
const priveYakroTrim1Router: Router = express.Router();


//route permettant de générer le rapport
priveYakroTrim1Router.get('/prive/secondairegeneral/yakro/1trimestre/:id', controllers.rapport); 

export default priveYakroTrim1Router;

