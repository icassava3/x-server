import express, { Router } from "express";
import controllers from "./controllers";
const priveIssia2Trim2Router: Router = express.Router();

//route permettant de générer le rapport
priveIssia2Trim2Router.get('/prive/secondairegeneral/issia/2trimestre/:id', controllers.rapport); 

export default priveIssia2Trim2Router;

