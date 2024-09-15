import express, { Router } from "express";
import controllers from "./controllers";
const privebouake1Trim1Router: Router = express.Router();


//route permettant de générer le rapport
privebouake1Trim1Router.get('/prive/secondairegeneral/bouake1/1trimestre/:id', controllers.rapport); 

export default privebouake1Trim1Router;

