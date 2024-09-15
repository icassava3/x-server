import express, { Router } from "express";
import controllers from "./controllers";
const priveAbidjan3Trim1Router: Router = express.Router();

//route permettant de générer le rapport
priveAbidjan3Trim1Router.get('/prive/secondairegeneral/abidjan3/1trimestre/:id', controllers.rapport); 

export default priveAbidjan3Trim1Router;

