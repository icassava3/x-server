import express, { Router } from "express";
import controllers from "./controllers";
const priveBouake2Trim3Router: Router = express.Router();



//route permettant de générer le rapport
priveBouake2Trim3Router.get('/prive/secondairegeneral/bouake2/3trimestre/:id', controllers.rapport); 

export default priveBouake2Trim3Router;

