import express, { Router } from "express";
import controllers from "./controllers";
const priveBouake2Trim2Router: Router = express.Router();


//route permettant de générer le rapport
priveBouake2Trim2Router.get('/prive/secondairegeneral/bouake2/1trimestre/:id', controllers.rapport); 

export default priveBouake2Trim2Router;

