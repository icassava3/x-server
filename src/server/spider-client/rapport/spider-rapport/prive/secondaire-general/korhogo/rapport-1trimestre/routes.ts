import express, { Router } from "express";
import controllers from "./controllers";
const priveKorhogoTrim1Router: Router = express.Router();

//route permettant de générer le rapport
priveKorhogoTrim1Router.get('/prive/secondairegeneral/korhogo/1trimestre/:id', controllers.rapport); 

export default priveKorhogoTrim1Router;

