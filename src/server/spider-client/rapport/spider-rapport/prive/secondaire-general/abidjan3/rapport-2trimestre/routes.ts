import express, { Router } from "express";
import controllers from "./controllers";
const priveAbidjan3Trim2Router: Router = express.Router();


//route permettant de générer le rapport
priveAbidjan3Trim2Router.get('/prive/secondairegeneral/abidjan3/2trimestre/:id', controllers.rapport); 

export default priveAbidjan3Trim2Router;

