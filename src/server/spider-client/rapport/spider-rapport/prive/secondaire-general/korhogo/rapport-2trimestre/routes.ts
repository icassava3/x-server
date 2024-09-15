import express, { Router } from "express";
import controllers from "./controllers";
const priveKorhogoTrim2Router: Router = express.Router();

//route permettant de générer le rapport
priveKorhogoTrim2Router.get('/prive/secondairegeneral/korhogo/2trimestre/:id', controllers.rapport); 

export default priveKorhogoTrim2Router;

