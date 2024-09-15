import express, { Router } from "express";
import controllers from "./controllers";
const priveKorhogoTrim3Router: Router = express.Router();

//route permettant de générer le rapport
priveKorhogoTrim3Router.get('/prive/secondairegeneral/korhogo/3trimestre/:id', controllers.rapport); 

export default priveKorhogoTrim3Router;

