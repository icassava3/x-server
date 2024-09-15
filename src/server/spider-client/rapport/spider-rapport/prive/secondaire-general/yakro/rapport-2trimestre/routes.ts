import express, { Router } from "express";
import controllers from "./controllers";
const priveYakroTrim2Router: Router = express.Router();


//route permettant de générer le rapport
priveYakroTrim2Router.get('/prive/secondairegeneral/yakro/2trimestre/:id', controllers.rapport); 

export default priveYakroTrim2Router;

