import express, { Router } from "express";
import controllers from "./controllers";
const publicSecondaireGeneral2trimestreRouter: Router = express.Router();

//route permettant de générer le rapport
publicSecondaireGeneral2trimestreRouter.get('/public/secondairegeneral/2trimestre/:id', controllers.rapport); 

export default publicSecondaireGeneral2trimestreRouter;

