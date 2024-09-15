import express, { Router } from "express";
import controllers from "./controllers";
const publicSecondaireGeneral1trimestreRouter: Router = express.Router();

//route permettant de générer le rapport
publicSecondaireGeneral1trimestreRouter.get('/public/secondairegeneral/1trimestre/:id', controllers.rapport); 

export default publicSecondaireGeneral1trimestreRouter;

