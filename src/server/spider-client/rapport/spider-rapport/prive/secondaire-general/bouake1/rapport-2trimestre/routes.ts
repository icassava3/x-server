import express, { Router } from "express";
import controllers from "./controllers";
const privebouake1Trim2Router: Router = express.Router();


//route permettant de générer le rapport
privebouake1Trim2Router.get('/prive/secondairegeneral/bouake1/2trimestre/:id', controllers.rapport); 

export default privebouake1Trim2Router;

