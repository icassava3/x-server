import express, { Router } from "express";
import controllers from "./controllers";
const priveAbidjan3RentreeRouter: Router = express.Router();

//route permettant de générer le rapport
priveAbidjan3RentreeRouter.get('/prive/secondairegeneral/abidjan3/rapportrentree/:id', controllers.rapport); 

export default priveAbidjan3RentreeRouter;

