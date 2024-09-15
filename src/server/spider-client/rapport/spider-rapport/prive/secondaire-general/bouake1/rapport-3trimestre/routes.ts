import express, { Router } from "express";
import controllers from "./controllers";
const privebouake1Trim3Router: Router = express.Router();


//route permettant de générer le rapport
privebouake1Trim3Router.get('/prive/secondairegeneral/bouake1/3trimestre/:id', controllers.rapport); 

export default privebouake1Trim3Router;

