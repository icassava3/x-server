import express, { Router } from "express";
import controllers from "./controllers";
const priveAbidjan3Trim3Router: Router = express.Router();


//route permettant de générer le rapport
priveAbidjan3Trim3Router.get('/prive/secondairegeneral/abidjan3/3trimestre/:id', controllers.rapport); 

export default priveAbidjan3Trim3Router;  