import express, { Router } from "express";
import controllers from "./controllers";
const priveIssia1Trim1Router: Router = express.Router();

//route permettant de générer le rapport
priveIssia1Trim1Router.get('/prive/secondairegeneral/issia/1trimestre/:id', controllers.rapport); 

export default priveIssia1Trim1Router;